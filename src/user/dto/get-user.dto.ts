import { IsEmail, IsUUID } from 'class-validator';

export class GetUserParamsDto {
  @IsUUID()
  id: string;
}

export class GetUserQueryDto {
  @IsEmail()
  email: string;
}
