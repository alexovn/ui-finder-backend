import { PrismaClient } from '../generated/prisma/client/index.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const libraryList = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/library/libraryList.json'), 'utf-8'),
);
const frameworkList = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/filter/frameworkList.json'), 'utf-8'),
);
const featureList = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/filter/featureList.json'), 'utf-8'),
);
const componentList = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/filter/componentList.json'), 'utf-8'),
);
const categoryList = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/filter/categoryList.json'), 'utf-8'),
);

const prisma = new PrismaClient();

async function seed() {
  const categoryEntries = await Promise.all(
    categoryList.map((category) =>
      prisma.category.upsert({
        where: { value: category.value },
        update: {
          name: category.name,
          value: category.value,
        },
        create: {
          name: category.name,
          value: category.value,
        },
      }),
    ),
  );

  const frameworkEntries = await Promise.all(
    frameworkList.map((framework) =>
      prisma.framework.upsert({
        where: { value: framework.value },
        update: {
          name: framework.name,
          value: framework.value,
        },
        create: {
          name: framework.name,
          value: framework.value,
        },
      }),
    ),
  );

  const featureEntries = await Promise.all(
    featureList.map((feature) =>
      prisma.feature.upsert({
        where: { value: feature.value },
        update: {
          name: feature.name,
          value: feature.value,
        },
        create: {
          name: feature.name,
          value: feature.value,
        },
      }),
    ),
  );
  const componentEntries = await Promise.all(
    componentList.map((component) =>
      prisma.component.upsert({
        where: { value: component.value },
        update: {
          name: component.name,
          value: component.value,
        },
        create: {
          name: component.name,
          value: component.value,
        },
      }),
    ),
  );

  await Promise.all(
    libraryList.map(async (library) => {
      const categoryEntry = categoryEntries.find(
        (category) => category.value === library.category,
      );
      const frameworkEntriesToConnect = frameworkEntries.filter((framework) =>
        library.frameworks.includes(framework.value),
      );
      const featureEntriesToConnect = featureEntries.filter((feature) =>
        library.features.includes(feature.value),
      );
      const componentEntriesToConnect =
        (library.components &&
          library.components.length &&
          componentEntries.filter((component) =>
            library.components.includes(component.value),
          )) ||
        [];

      await prisma.library.upsert({
        where: { value: library.value },
        update: {
          name: library.name,
          value: library.value,
          img: library.img,
          link: library.link,
          githubRepo: library.githubRepo,
          npmPackage: library.npmPackage,
          category: {
            connect: { id: categoryEntry?.id },
          },
          frameworks: {
            connect: frameworkEntriesToConnect.map((framework) => ({
              id: framework.id,
            })),
          },
          features: {
            connect: featureEntriesToConnect.map((feature) => ({
              id: feature.id,
            })),
          },
          components: {
            connect: componentEntriesToConnect.map((component) => ({
              id: component.id,
            })),
          },
        },
        create: {
          name: library.name,
          value: library.value,
          img: library.img,
          link: library.link,
          githubRepo: library.githubRepo,
          npmPackage: library.npmPackage,
          category: {
            connect: { id: categoryEntry?.id },
          },
          frameworks: {
            connect: frameworkEntriesToConnect.map((framework) => ({
              id: framework.id,
            })),
          },
          features: {
            connect: featureEntriesToConnect.map((feature) => ({
              id: feature.id,
            })),
          },
          components: {
            connect: componentEntriesToConnect.map((component) => ({
              id: component.id,
            })),
          },
        },
      });
    }),
  );
}

async function seedDb() {
  try {
    console.log('Seeding db...');
    await seed();
    await prisma.$disconnect();
    console.log('Db has been seeded!');
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedDb();
