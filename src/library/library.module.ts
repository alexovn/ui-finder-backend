import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma.service';

import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

import { GithubModule } from '../utils/github/github.module';
import { GithubService } from '../utils/github/github.service';

import { NpmModule } from '../utils/npm/npm.module';
import { NpmService } from '../utils/npm/npm.service';

import { LibraryStatsModule } from '../utils/library-stats/library-stats.modules';
import { LibraryStatsService } from '../utils/library-stats/library-stats.service';

@Module({
  imports: [GithubModule, NpmModule, LibraryStatsModule, HttpModule],
  controllers: [LibraryController],
  providers: [
    PrismaService,
    LibraryService,
    GithubService,
    NpmService,
    LibraryStatsService,
  ],
})
export class LibraryModule {}
