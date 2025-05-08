import { Controller } from '@nestjs/common';
import { FilterService } from './filter.service';

@Controller()
export class FilterController {
  constructor(private readonly filterService: FilterService) {}
}
