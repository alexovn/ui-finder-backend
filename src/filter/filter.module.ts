import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FilterService } from './filter.service';
import { FilterController } from './filter.controller';

@Module({
  controllers: [FilterController],
  providers: [PrismaService, FilterService],
})
export class FilterModule {}
