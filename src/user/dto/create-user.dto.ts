import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  userName: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;
}
