import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { LibraryService } from './library.service';
import { GetLibrariesDto } from './dto/get-libraries.dto';
import { Libraries } from './interfaces/library.interface';

@Controller('libraries')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  async getLibraries(
    @Query(new ValidationPipe()) getLibrariesDto: GetLibrariesDto,
  ): Promise<Libraries> {
    return await this.libraryService.getLibraries(getLibrariesDto);
  }
}
