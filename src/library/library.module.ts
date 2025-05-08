import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LibraryController],
  providers: [PrismaService, LibraryService],
})
export class LibraryModule {}
