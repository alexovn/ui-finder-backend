import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { GetLibrariesDto } from './dto/get-libraries.dto';
import { Library, Libraries } from './interfaces/library.interface';
import { GetLibraryParamsDto } from './dto/get-library.dto';
import { CreateLibraryDto } from './dto/create-library.dto';

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
  async getLibrary(
    @Param(new ValidationPipe()) params: GetLibraryParamsDto,
  ): Promise<Library | null> {
    return await this.libraryService.getLibrary(params);
  }

  @Post()
  async createLibrary(
    @Body(new ValidationPipe()) createLibraryDto: CreateLibraryDto,
  ): Promise<Library> {
    return await this.libraryService.createLibrary(createLibraryDto);
  }
}
