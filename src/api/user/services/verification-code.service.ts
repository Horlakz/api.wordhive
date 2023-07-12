import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VerificationCode } from '../entities/verification-code.entity';
import { UserService } from './user.service';
import { AppUtilities } from '@/app.utilities';

@Injectable()
export class VerificationCodeService {
  constructor(
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,

    private userService: UserService,
  ) {}

  async createVerificationCode(email: string): Promise<string> {
    const user = await this.userService.findOne(email);

    const verificationCode = new VerificationCode();
    verificationCode.code = AppUtilities.generateRandomNumber(6);
    verificationCode.user = user;

    await this.verificationCodeRepository.save(verificationCode);
    return verificationCode.code;
  }

  async findCodeAndEmail(
    email: string,
    code: string,
  ): Promise<VerificationCode | undefined> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { user: { email }, code },
    });

    return verificationCode;
  }

  async findCodeByEmail(email: string): Promise<VerificationCode | undefined> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { user: { email } },
    });

    return verificationCode;
  }

  async deleteVerificationCode(email: string): Promise<void> {
    const user = await this.userService.findOne(email);

    await this.verificationCodeRepository.delete({ user });
  }

  hasCodeExpired(verificationCode: VerificationCode): boolean {
    const expirationTimeInMinutes = 10;
    const now = new Date();
    const expirationDate = new Date(verificationCode.created_at);
    expirationDate.setMinutes(
      expirationDate.getMinutes() + expirationTimeInMinutes,
    );

    return now > expirationDate;
  }
}
