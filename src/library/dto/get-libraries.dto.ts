import { IsOptional, Min, IsIn, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLibrariesDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([10, 50, 150])
  perPage?: number;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'githubStarts', 'npmDownloads'])
  orderBy?: 'createdAt' | 'githubStarts' | 'npmDownloads';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  orderDir?: 'asc' | 'desc';

  @IsOptional()
  categories?: string[];

  @IsOptional()
  frameworks?: string[];

  @IsOptional()
  features?: string[];

  @IsOptional()
  components?: string[];
}
