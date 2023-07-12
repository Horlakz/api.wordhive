import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/api/user/services/user.service';
import { VerificationCodeService } from '@/api/user/services/verification-code.service';
import { AppUtilities } from '@/app.utilities';
import { MailOptions } from '@/common/interfaces/mail-options';
import { EmailService } from '@/shared/services/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

enum Template {
  CONFIRM_EMAIL = 'confirm-email',
  RESET_PASSWORD = 'reset-password',
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private verifCodeService: VerificationCodeService,
    private emailService: EmailService,
  ) {}

  private payload: { sub: string };
  private code: string;

  async login(loginDto: LoginDto): Promise<string> {
    try {
      const user = await this.userService.findOne(loginDto.email);
      if (!user) throw new NotFoundException('User not found');

      if (!user.isEmailVerified)
        throw new UnauthorizedException('Email is not verified');

      const comparePassword = await AppUtilities.validateHash(
        loginDto.password,
        user.password,
      );
      if (!comparePassword)
        throw new UnauthorizedException('Passwords do not match');

      this.payload = { sub: user.uuid };
    } catch (err) {
      throw new BadRequestException(err?.message);
    }

    const accessToken = await this.jwtService.signAsync(this.payload);

    return accessToken;
  }

  async register(registerDto: RegisterDto): Promise<void> {
    try {
      const user = await this.userService.findOne(registerDto.email);
      if (user) {
        throw new BadRequestException('User already exists');
      }

      const newUser = await this.userService.create(
        registerDto.fullname,
        registerDto.email,
        registerDto.password,
      );

      await this.sendVerificationCode(newUser.email, Template.CONFIRM_EMAIL);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async sendVerificationCode(email: string, type: Template): Promise<void> {
    try {
      const user = await this.userService.findOne(email);
      if (!user) throw new NotFoundException('User not found');

      const checkIfCodeExists = await this.verifCodeService.findCodeByEmail(
        email,
      );
      if (checkIfCodeExists)
        await this.verifCodeService.deleteVerificationCode(email);

      if (user.isEmailVerified && type == Template.CONFIRM_EMAIL) {
        throw new BadRequestException('Email has already been verified');
      }

      this.code = await this.verifCodeService.createVerificationCode(email);
      const options: MailOptions = {
        to: email,
        subject:
          type == Template.CONFIRM_EMAIL
            ? 'Verification Code'
            : 'Reset Password Code',
        template: type,
        context: {
          name: user.fullname,
          code: this.code,
        },
      };

      await this.emailService.sendEmail(options);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    try {
      const user = await this.userService.findOne(email);
      if (!user) throw new NotFoundException('User not found');

      if (user.isEmailVerified)
        throw new BadRequestException('Email already verified');

      await this.verifyCode(email, code);
      await this.userService.verifyEmail(email);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async resetPassword(
    email: string,
    code: string,
    password: string,
  ): Promise<void> {
    try {
      const user = await this.userService.findOne(email);
      if (!user) throw new NotFoundException('User not found');

      await this.verifyCode(email, code);
      await this.userService.updatePassword(email, password);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyCode(email: string, code: string): Promise<void> {
    try {
      const findCode = await this.verifCodeService.findCodeByEmail(email);
      if (!findCode) throw new NotFoundException('Verification code not found');

      const checkIfCodeIsValid = await this.verifCodeService.findCodeAndEmail(
        email,
        code,
      );
      if (!checkIfCodeIsValid)
        throw new BadRequestException('Invalid verification code');

      const hasCodeExpired = await this.verifCodeService.hasCodeExpired(
        findCode,
      );
      if (hasCodeExpired) throw new BadRequestException('Code has expired');

      await this.verifCodeService.deleteVerificationCode(email);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
