import { Controller, Get } from '@nestjs/common';

import { FilterService } from './filter.service';
import { Category } from './interfaces/category.interface';
import { Public } from '../auth/decorators/public.decorator';
import { Framework } from './interfaces/framework.interface';
import { Feature } from './interfaces/feature.interface';
import { Component } from './interfaces/component.interface';

@Controller()
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @Public()
  @Get('categories')
  async getCategories(): Promise<Category[]> {
    return this.filterService.getCategories();
  }

  @Public()
  @Get('frameworks')
  async getFrameworks(): Promise<Framework[]> {
    return this.filterService.getFrameworks();
  }

  @Public()
  @Get('features')
  async getFeatures(): Promise<Feature[]> {
    return this.filterService.getFeatures();
  }

  @Public()
  @Get('components')
  async getComponents(): Promise<Component[]> {
    return this.filterService.getComponents();
  }
}
