import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}
}
