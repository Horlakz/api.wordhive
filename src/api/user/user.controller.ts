import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';

import { RequiresUser } from '@/common/decorators/require-user.decorator';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @RequiresUser()
  @HttpCode(HttpStatus.OK)
  @Get()
  async profile(@Req() req) {
    const user = await this.userService.findByUUID(req.user.sub);
    if (!user) throw new BadRequestException('User not found');

    return { email: user.email, fullname: user.fullname };
  }
}
