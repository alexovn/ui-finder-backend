import { IsUUID } from 'class-validator';

export class GetLibraryParamsDto {
  @IsUUID()
  id: string;
}
