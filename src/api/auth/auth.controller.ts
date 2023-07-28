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
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterDto } from './dto/register.dto';

enum Template {
  CONFIRM_EMAIL = 'confirm-email',
  RESET_PASSWORD = 'reset-password',
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return { message: 'Login Successful', access_token: token };
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    await this.authService.register(registerDto);
    return { message: 'Verification code sent to email' };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register-admin')
  async registerAdmin(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return { message: 'Verification code sent to email' };
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: { email: string; code: string }) {
    const { email, code } = verifyEmailDto;
    if (!email || !code)
      throw new BadRequestException('email and code are required');

    await this.authService.verifyEmail(email, code);

    return { message: 'Email verified' };
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('resend-code')
  async resendCode(@Body() resendCodeDto: { email: string }) {
    const { email } = resendCodeDto;
    if (!email) throw new BadRequestException('email is required');

    await this.authService.sendVerificationCode(email, Template.CONFIRM_EMAIL);

    return { message: 'Verification code sent to email' };
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: { email: string }) {
    const { email } = forgotPasswordDto;
    if (!email) throw new BadRequestException('email is required');

    await this.authService.sendVerificationCode(email, Template.RESET_PASSWORD);

    return { message: 'Password reset code sent to email' };
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: { email: string; password: string; code: string },
  ) {
    const { email, password, code } = resetPasswordDto;
    if (!email || !password || !code)
      throw new BadRequestException('all fields are required');

    await this.authService.resetPassword(email, code, password);

    return { message: 'Password reset successful' };
  }
}
