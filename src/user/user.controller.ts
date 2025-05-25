import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { UserService } from './user.service';
import { GetUserQueryDto, GetUserParamsDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserParamsDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('email')
  async getUserByEmail(@Query() query: GetUserQueryDto): Promise<User> {
    const user = await this.userService.getUserByEmail(query);
    if (!user) {
      throw new NotFoundException(`User with email ${query.email} not found`);
    }
    return user;
  }

  @Get(':id')
  async getUserById(@Param() params: GetUserParamsDto): Promise<User> {
    const user = await this.userService.getUserById(params);
    if (!user) {
      throw new NotFoundException(`User with id ${params.id} not found`);
    }
    return user;
  }

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return await this.userService.createUser(data);
  }

  @Patch(':id')
  async updateUser(
    @Param() params: UpdateUserParamsDto,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser({ params, data });
  }

  @Delete(':id')
  async deleteUser(@Param() params: DeleteUserDto): Promise<User> {
    return await this.userService.deleteUser(params);
  }
}
