import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Category } from './interfaces/category.interface';
import { Framework } from './interfaces/framework.interface';
import { Feature } from './interfaces/feature.interface';
import { Component } from './interfaces/component.interface';

@Injectable()
export class FilterService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            libraries: true,
          },
        },
      },
    });
  }

  async getFrameworks(): Promise<Framework[]> {
    return this.prisma.framework.findMany({
      include: {
        _count: {
          select: {
            libraries: true,
          },
        },
      },
    });
  }

  async getFeatures(): Promise<Feature[]> {
    return this.prisma.feature.findMany({
      include: {
        _count: {
          select: {
            libraries: true,
          },
        },
      },
    });
  }

  async getComponents(): Promise<Component[]> {
    return this.prisma.component.findMany({
      include: {
        _count: {
          select: {
            libraries: true,
          },
        },
      },
    });
  }
}
