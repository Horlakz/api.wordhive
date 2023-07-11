import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/api/user/user.service';
import { AppUtilities } from '@/app.utilities';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private payload: { sub: string };

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.userService.findOne(loginDto.email);

      if (!user) throw new NotFoundException('User not found');

      const comparePassword = await AppUtilities.validateHash(
        loginDto.password,
        user.password,
      );
      if (!comparePassword)
        throw new UnauthorizedException('Passwords do not match');

      this.payload = { sub: user.uuid };
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return {
      access_token: await this.jwtService.signAsync(this.payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    try {
      const exists = await this.userService.findOne(registerDto.email);
      if (exists) throw new BadRequestException('User already exists');

      const user = await this.userService.create(
        registerDto.fullname,
        registerDto.email,
        registerDto.password,
      );
      this.payload = { sub: user.uuid };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
    return {
      access_token: await this.jwtService.signAsync(this.payload),
    };
  }
}
