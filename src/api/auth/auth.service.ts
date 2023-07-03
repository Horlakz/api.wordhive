import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@/api/users/users.service';

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

      const comparePassword = await bcrypt.compare(pass, user.password);
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

      const hashedPasword = await this.hashPassword(pass);

      const user = await this.userService.create(
        fullname,
        email,
        hashedPasword,
      );
      payload = { email: user.email, sub: user.uuid };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 12;
    const salt: string = await bcrypt.genSalt(saltRound);

    return await bcrypt.hash(password, salt);
  }
}
