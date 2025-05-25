import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;
}

export class UpdateUserParamsDto {
  @IsUUID()
  id: string;
}
