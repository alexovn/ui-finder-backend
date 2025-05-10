import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GetLibrariesDto } from './dto/get-libraries.dto';
import { GetLibraryParamsDto } from './dto/get-library.dto';
import { CreateLibraryDto } from './dto/create-library.dto';
import { Library, Libraries } from './interfaces/library.interface';
import { GithubService } from '../github/github.service';
import { NpmService } from '../npm/npm.service';
import {
  UpdateLibraryDto,
  UpdateLibraryParamsDto,
} from './dto/update-library.dto';

@Injectable()
export class LibraryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly npmService: NpmService,
  ) {}

  async getLibraries(query: GetLibrariesDto): Promise<Libraries> {
    const {
      search,
      page = 1,
      perPage = 10,
      orderBy = 'createdAt',
      orderDir = 'desc',
      categories: _categories,
      frameworks: _frameworks,
      features: _features,
      components: _components,
    } = query;

    const skip = (page - 1) * perPage;

    function transformData(data: string | string[] | undefined): string[] {
      if (Array.isArray(data)) {
        return data;
      }
      if (data) {
        return data.split(',');
      }
      return [];
    }

    const categories = transformData(_categories);
    const frameworks = transformData(_frameworks);
    const features = transformData(_features);
    const components = transformData(_components);

    const searchQuery = search?.trim() || '';
    const searchCondition = searchQuery
      ? `("Library"."name" % $1 
      OR EXISTS (SELECT 1 FROM "_FrameworkToLibrary" JOIN "Framework" ON "_FrameworkToLibrary"."A" = "Framework"."id" WHERE "_FrameworkToLibrary"."B" = "Library"."id" AND "Framework"."value" % $1)
      OR EXISTS (SELECT 1 FROM "_FeatureToLibrary" JOIN "Feature" ON "_FeatureToLibrary"."A" = "Feature"."id" WHERE "_FeatureToLibrary"."B" = "Library"."id" AND "Feature"."value" % $1)
      OR EXISTS (SELECT 1 FROM "_ComponentToLibrary" JOIN "Component" ON "_ComponentToLibrary"."A" = "Component"."id" WHERE "_ComponentToLibrary"."B" = "Library"."id" AND "Component"."value" % $1))`
      : 'TRUE';

    const whereClause = `
    WHERE ${searchCondition}
    ${categories.length ? `AND "Library"."categoryId" IN (SELECT "id" FROM "Category" WHERE "value" IN (${categories.map((c) => `'${c}'`).join(',')}))` : ''}
    ${frameworks.length ? `AND EXISTS (SELECT 1 FROM "_FrameworkToLibrary" JOIN "Framework" ON "_FrameworkToLibrary"."A" = "Framework"."id" WHERE "_FrameworkToLibrary"."B" = "Library"."id" AND "Framework"."value" IN (${frameworks.map((f) => `'${f}'`).join(',')}))` : ''}
    ${features.length ? `AND EXISTS (SELECT 1 FROM "_FeatureToLibrary" JOIN "Feature" ON "_FeatureToLibrary"."A" = "Feature"."id" WHERE "_FeatureToLibrary"."B" = "Library"."id" AND "Feature"."value" IN (${features.map((f) => `'${f}'`).join(',')}))` : ''}
    ${components.length ? `AND EXISTS (SELECT 1 FROM "_ComponentToLibrary" JOIN "Component" ON "_ComponentToLibrary"."A" = "Component"."id" WHERE "_ComponentToLibrary"."B" = "Library"."id" AND "Component"."value" IN (${components.map((c) => `'${c}'`).join(',')}))` : ''}
  `;

    const libraries: Library[] = await this.prisma.$queryRawUnsafe(
      `
      SELECT "Library".*,
            similarity("Library"."name", COALESCE($1, '')) AS name_similarity,
            jsonb_build_object('id', "Category"."id", 'name', "Category"."name", 'value', "Category"."value") AS "category",
            COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "Framework"."id", 'name', "Framework"."name", 'value', "Framework"."value")) 
            FILTER (WHERE "Framework"."id" IS NOT NULL), '[]') AS "frameworks",
            COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "Feature"."id", 'name', "Feature"."name", 'value', "Feature"."value")) 
            FILTER (WHERE "Feature"."id" IS NOT NULL), '[]') AS "features",
            COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "Component"."id", 'name', "Component"."name", 'value', "Component"."value")) 
            FILTER (WHERE "Component"."id" IS NOT NULL), '[]') AS "components"
      FROM "Library"
      LEFT JOIN "Category" ON "Library"."categoryId" = "Category"."id"
      LEFT JOIN "_FrameworkToLibrary" ON "Library"."id" = "_FrameworkToLibrary"."B"
      LEFT JOIN "Framework" ON "_FrameworkToLibrary"."A" = "Framework"."id"
      LEFT JOIN "_FeatureToLibrary" ON "Library"."id" = "_FeatureToLibrary"."B"
      LEFT JOIN "Feature" ON "_FeatureToLibrary"."A" = "Feature"."id"
      LEFT JOIN "_ComponentToLibrary" ON "Library"."id" = "_ComponentToLibrary"."B"
      LEFT JOIN "Component" ON "_ComponentToLibrary"."A" = "Component"."id"
      ${whereClause}
      GROUP BY "Library"."id", "Category"."id"
      ORDER BY name_similarity DESC, "Library"."${orderBy}" ${orderDir.toUpperCase()}
      LIMIT ${perPage} OFFSET ${skip};
      `,
      searchQuery,
    );

    const totalResult: any = await this.prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*) AS total FROM "Library"
      ${whereClause};
      `,
      searchQuery,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const total = Number(totalResult[0]?.total || 0);
    const totalPages = Math.ceil(total / perPage);

    return {
      data: libraries,
      meta: {
        pagination: {
          page,
          total,
          totalPages,
        },
      },
    };
  }

  async getLibrary(params: GetLibraryParamsDto): Promise<Library | null> {
    const { id } = params;

    return await this.prisma.library.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        frameworks: true,
        features: true,
        components: true,
      },
    });
  }

  async createLibrary(body: CreateLibraryDto): Promise<Library> {
    const existingLibrary = await this.prisma.library.findFirst({
      where: {
        value: body.value,
      },
    });

    if (existingLibrary) {
      throw new BadRequestException({
        message: `Library with value ${body.value} already exists.`,
      });
    }

    const categoryExists = await this.prisma.category.findUnique({
      where: { value: body.category },
    });

    if (!categoryExists) {
      throw new BadRequestException({
        message: `Category with ID ${body.category} does not exist`,
      });
    }

    const [existingFrameworks, existingFeatures, existingComponents] =
      await Promise.all([
        this.prisma.framework.findMany({
          where: { value: { in: body.frameworks || [] } },
        }),
        this.prisma.feature.findMany({
          where: { value: { in: body.features || [] } },
        }),
        this.prisma.component.findMany({
          where: { value: { in: body.components || [] } },
        }),
      ]);

    if (
      !existingFrameworks.some((framework) =>
        body.frameworks.includes(framework.value),
      )
    ) {
      throw new BadRequestException({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Wrong frameworks array: ${body.frameworks}.`,
      });
    }
    if (
      !existingFeatures.some((feature) => body.features.includes(feature.value))
    ) {
      throw new BadRequestException({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Wrong features array: ${body.features}.`,
      });
    }
    if (
      !existingComponents.some((component) =>
        body.components.includes(component.value),
      )
    ) {
      throw new BadRequestException({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Wrong components array: ${body.components}.`,
      });
    }

    let githubData;
    let npmData;
    if (body.githubRepo && body.npmPackage) {
      const repo = body.githubRepo.replace('https://github.com/', '');
      const packageName = body.npmPackage.replace(
        'https://www.npmjs.com/package/',
        '',
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const [githubRepoData, npmPackageData] = await Promise.all([
        this.githubService.fetchLibraryGithubData(repo),
        this.npmService.fetchLibraryNpmData(packageName),
      ]);

      if (githubRepoData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        githubData = githubRepoData;
      }
      if (npmPackageData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        npmData = npmPackageData;
      }
    }

    const library: Library = await this.prisma.library.create({
      data: {
        name: body.name,
        value: body.value,
        img: body.img || null,
        link: body.link || null,
        githubRepo: body.githubRepo || null,
        npmPackage: body.npmPackage || null,
        category: {
          connect: {
            id: categoryExists.id,
          },
        },
        frameworks: {
          connect: existingFrameworks.map((framework) => ({
            id: framework.id,
          })),
        },
        features: {
          connect: existingFeatures.map((feature) => ({ id: feature.id })),
        },
        components: {
          connect: existingComponents.map((component) => ({
            id: component.id,
          })),
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        githubStars: (githubData?.stargazers_count as number) || 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        npmDownloads: (npmData?.downloads as number) || 0,
      },
      include: {
        category: true,
        frameworks: true,
        features: true,
        components: true,
      },
    });

    return library;
  }

  async updateLibrary(
    params: UpdateLibraryParamsDto,
    body: UpdateLibraryDto,
  ): Promise<Library> {
    const { id } = params;

    const existingLibrary = await this.prisma.library.findUnique({
      where: {
        id,
      },
    });

    if (!existingLibrary) {
      throw new BadRequestException({
        message: `Library with ID ${id} does not exist.`,
      });
    }

    let categoryExists;
    if (body.category) {
      categoryExists = await this.prisma.category.findUnique({
        where: { value: body.category },
      });

      if (!categoryExists) {
        throw new BadRequestException({
          message: `Category with ID ${body.category} does not exist.`,
        });
      }
    }

    const existingFrameworks = body.frameworks
      ? await this.prisma.framework.findMany({
          where: { value: { in: body.frameworks } },
        })
      : [];

    const existingFeatures = body.features
      ? await this.prisma.feature.findMany({
          where: { value: { in: body.features } },
        })
      : [];

    const existingComponents = body.components
      ? await this.prisma.component.findMany({
          where: { value: { in: body.components } },
        })
      : [];

    let githubData;
    let npmData;
    if (body.githubRepo && body.npmPackage) {
      const repo = body.githubRepo.replace('https://github.com/', '');
      const packageName = body.npmPackage.replace(
        'https://www.npmjs.com/package/',
        '',
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const [githubRepoData, npmPackageData] = await Promise.all([
        this.githubService.fetchLibraryGithubData(repo),
        this.npmService.fetchLibraryNpmData(packageName),
      ]);

      if (githubRepoData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        githubData = githubRepoData;
      }
      if (npmPackageData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        npmData = npmPackageData;
      }
    }

    const updateData = {
      name: body.name || undefined,
      value: body.value || undefined,
      img: body.img || undefined,
      link: body.link || undefined,
      category: categoryExists
        ? { connect: { id: categoryExists.id } }
        : undefined,
      frameworks: existingFrameworks.length
        ? { set: existingFrameworks.map((f) => ({ id: f.id })) }
        : undefined,
      features: existingFeatures.length
        ? { set: existingFeatures.map((f) => ({ id: f.id })) }
        : undefined,
      components: existingComponents.length
        ? { set: existingComponents.map((c) => ({ id: c.id })) }
        : undefined,
      githubRepo: body.githubRepo || undefined,
      npmPackage: body.npmPackage || undefined,
      githubStars: githubData
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (githubData.stargazers_count as number)
        : undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      npmDownloads: npmData ? (npmData.downloads as number) : undefined,
    };

    const library: Library = await this.prisma.library.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        category: true,
        frameworks: true,
        features: true,
        components: true,
      },
    });

    return library;
  }
}
