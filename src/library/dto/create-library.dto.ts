import { IsOptional } from 'class-validator';

export class CreateLibraryDto {
  name: string;

  value: string;

  @IsOptional()
  img?: string;

  @IsOptional()
  link?: string;

  category: string;

  frameworks: string[];

  features: string[];

  components: string[];

  @IsOptional()
  githubRepo?: string;

  @IsOptional()
  npmPackage?: string;
}
