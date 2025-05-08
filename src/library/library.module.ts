import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { PrismaService } from '../prisma.service';
import { GithubModule } from '../github/github.module';
import { NpmModule } from '../npm/npm.module';
import { GithubService } from '../github/github.service';
import { NpmService } from '../npm/npm.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [GithubModule, NpmModule, HttpModule],
  controllers: [LibraryController],
  providers: [PrismaService, LibraryService, GithubService, NpmService],
})
export class LibraryModule {}
