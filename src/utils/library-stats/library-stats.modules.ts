import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { LibraryStatsService } from './library-stats.service';
import { GithubService } from '../github/github.service';
import { NpmService } from '../npm/npm.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PrismaService, GithubService, NpmService, LibraryStatsService],
})
export class LibraryStatsModule {}
