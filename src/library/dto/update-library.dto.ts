import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateLibraryDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  frameworks: string[];

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  features: string[];

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  components: string[];

  @IsOptional()
  @IsString()
  githubRepo?: string;

  @IsOptional()
  @IsString()
  npmPackage?: string;
}

export class UpdateLibraryParamsDto {
  @IsUUID()
  id: string;
}
