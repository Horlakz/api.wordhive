import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';

import { UserService } from './services/user.service';
import { RequiresUser } from '@/common/decorators/require-user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @RequiresUser()
  @HttpCode(HttpStatus.OK)
  @Get()
  async profile(@Req() req) {
    const user = await this.userService.findByUUID(req.user.sub);

    return { email: user.email, fullname: user.fullname };
  }
}
