import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '@/api/users/users.service';
import { AppUtilities } from '@/app.utilities';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    let payload: { email: string; sub: string };
    try {
      const user = await this.userService.findOne(email);

      if (!user) throw new NotFoundException('User not found');

      const comparePassword = await AppUtilities.validateHash(
        pass,
        user.password,
      );
      if (!comparePassword)
        throw new UnauthorizedException('Passwords do not match');

      payload = { email: user.email, sub: user.uuid };
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(fullname: string, email: string, pass: string): Promise<any> {
    let payload: { email: string; sub: string };

    try {
      const exists = await this.userService.findOne(email);
      if (exists) throw new BadRequestException('User already exists');

      const user = await this.userService.create(fullname, email, pass);
      payload = { email: user.email, sub: user.uuid };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
