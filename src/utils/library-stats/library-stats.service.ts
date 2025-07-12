import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { GithubService } from '../github/github.service';
import { NpmService } from '../npm/npm.service';

@Injectable()
export class LibraryStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly npmService: NpmService,
  ) {}

  async updateLibraryStats(
    libraryId: string,
    githubRepo: string | null,
    npmPackage: string | null,
  ) {
    const repo = githubRepo
      ? githubRepo.replace('https://github.com/', '')
      : null;
    const packageName = npmPackage
      ? npmPackage.replace('https://www.npmjs.com/package/', '')
      : null;

    const [githubStars, npmDownloads] = await Promise.all([
      repo ? this.githubService.fetchLibraryGithubData(repo) : null,
      packageName ? this.npmService.fetchLibraryNpmData(packageName) : null,
    ]);

    await this.prisma.library.update({
      where: { id: libraryId },
      data: {
        githubStars: githubStars || 0,
        npmDownloads: npmDownloads || 0,
      },
    });

    return { githubStars, npmDownloads };
  }
}
