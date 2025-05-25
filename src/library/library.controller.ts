import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { LibraryService } from './library.service';
import { GetLibrariesDto } from './dto/get-libraries.dto';
import { Library, Libraries } from './interfaces/library.interface';
import { GetLibraryParamsDto } from './dto/get-library.dto';
import { CreateLibraryDto } from './dto/create-library.dto';
import {
  UpdateLibraryDto,
  UpdateLibraryParamsDto,
} from './dto/update-library.dto';
import { Public } from '../auth/decorators/public.decorator';
@Controller('libraries')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Public()
  @Get()
  async getLibraries(
    @Query(new ValidationPipe()) getLibrariesDto: GetLibrariesDto,
  ): Promise<Libraries> {
    return await this.libraryService.getLibraries(getLibrariesDto);
  }

  @Public()
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

  @Patch(':id')
  async updateLibrary(
    @Param(new ValidationPipe()) params: UpdateLibraryParamsDto,
    @Body(new ValidationPipe()) body: UpdateLibraryDto,
  ): Promise<Library> {
    return await this.libraryService.updateLibrary(params, body);
  }
}
