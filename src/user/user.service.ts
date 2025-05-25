import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { GetUserQueryDto, GetUserParamsDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(params: GetUserParamsDto): Promise<User | null> {
    const { id } = params;

    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(query: GetUserQueryDto): Promise<User | null> {
    const { email } = query;

    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser({
    params,
    data,
  }: {
    params: GetUserParamsDto;
    data: UpdateUserDto;
  }): Promise<User> {
    const { id } = params;

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(params: DeleteUserDto): Promise<User> {
    const { id } = params;

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
