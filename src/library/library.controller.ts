import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { LibraryService } from './library.service';
import { GetLibrariesDto } from './dto/get-libraries.dto';
import { Libraries } from './interfaces/library.interface';
import { GetLibraryParamsDto } from './dto/get-library.dto';

@Controller('libraries')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  async getLibraries(
    @Query(new ValidationPipe()) getLibrariesDto: GetLibrariesDto,
  ): Promise<Libraries> {
    return await this.libraryService.getLibraries(getLibrariesDto);
  }

  @Get(':id')
  async getLibrary(@Param(new ValidationPipe()) params: GetLibraryParamsDto) {
    return await this.libraryService.getLibrary(params);
  }
}
