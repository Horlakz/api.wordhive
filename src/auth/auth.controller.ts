import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
// careers@termii.com
import { Public } from '@/common/decorators/auth.public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    if (!registerDto.email || !registerDto.password || !registerDto.fullname)
      throw new BadRequestException('All fields are required)');

    return this.authService.register(
      registerDto.fullname,
      registerDto.email,
      registerDto.password,
    );
  }
}
