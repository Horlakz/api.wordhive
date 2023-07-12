import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { VerificationCodeService } from './services/verification-code.service';
import { VerificationCode } from './entities/verification-code.entity';

const providers = [UserService, VerificationCodeService];

@Module({
  imports: [TypeOrmModule.forFeature([User, VerificationCode])],
  providers,
  exports: [...providers],
  controllers: [UserController],
})
export class UserModule {}
