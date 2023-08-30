import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';

import { RequiresUser } from '@/common/decorators/require-user.decorator';
import { PaginationResponseDto } from '@/common/dto/paginationResponse.dto';
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
  async getAllUsers(
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pagination = { page, limit };

    const { data, total } = await this.userService.findAll({
      isAdmin: false,
      name,
      pagination,
    });

    const response: PaginationResponseDto<(typeof data)[0]> = {
      results: data,
      pagination: {
        total: total,
        page: Number(pagination.page),
        limit: Number(pagination.limit),
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return response;
  }

  @Get('admin')
  async getAllAdmins(
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pagination = { page, limit };

    const { data, total } = await this.userService.findAll({
      isAdmin: true,
      name,
      pagination,
    });

    const response: PaginationResponseDto<(typeof data)[0]> = {
      results: data,
      pagination: {
        total: total,
        page: Number(pagination.page),
        limit: Number(pagination.limit),
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return response;
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':uuid')
  async removeUserByUUID(@Param('uuid', ParseUUIDPipe) uuid) {
    const user = await this.userService.findByUUID(uuid);
    if (!user) throw new BadRequestException('User not found');

    await this.userService.remove(user);
  }
}
