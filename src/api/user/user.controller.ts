import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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

    return {
      email: user.email,
      fullname: user.fullname,
      is_admin: user.isAdmin,
    };
  }

  @Get('all')
  async getAllUsers() {
    const users = await this.userService.findAll();
    return users;
  }

  @Get('admin')
  async getAllAdmins() {
    const users = await this.userService.findAll({ isAdmin: true });
    return users;
  }

  @Get(':uuid')
  async getUserByUUID(@Param('uuid', ParseUUIDPipe) uuid) {
    const user = await this.userService.findByUUID(uuid);
    if (!user) throw new BadRequestException('User not found');

    return {
      email: user.email,
      fullname: user.fullname,
      createdAt: user.created_at,
    };
  }
}
