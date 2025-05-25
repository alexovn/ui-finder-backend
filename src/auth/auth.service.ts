import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/interfaces/user.interface';
import { AccessToken } from './interfaces/accessToken.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  login(user: User): AccessToken {
    const payload = { id: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(data: CreateUserDto): Promise<AccessToken> {
    const user = await this.userService.getUserByEmail({ email: data.email });
    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = { ...data, password: hashedPassword };
    const createdUser = await this.userService.createUser(newUser);

    return this.login(createdUser);
  }
}
