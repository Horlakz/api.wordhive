import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async profile(@Req() req) {
    const user = await this.userService.findOne(req.user.email);

    return { email: user.email, fullname: user.fullname };
  }
}
