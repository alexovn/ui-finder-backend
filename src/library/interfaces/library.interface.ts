import { Framework } from '../../filter/interfaces/framework.interface';
import { Feature } from '../../filter/interfaces/feature.interface';
import { Component } from '../../filter/interfaces/component.interface';
import { Category } from '../../filter/interfaces/category.interface';

export interface Library {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  value: string;
  img: string | null;
  link: string | null;
  frameworks: Framework[];
  features: Feature[];
  components: Component[];
  githubRepo: string | null;
  npmPackage: string | null;
  githubStars: number;
  npmDownloads: number;
  category: Category;
  categoryId: number;
}

export interface Libraries {
  data: Library[];
  meta: {
    pagination: {
      page: number;
      total: number;
      totalPages: number;
    };
  };
}
