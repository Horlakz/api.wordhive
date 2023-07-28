import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UUID } from 'crypto';

import { UserService } from '@/api/user/services/user.service';
import { ISPUBLICKEY } from '@/common/decorators/auth.public.decorator';
import { REQUIRESUSERKEY } from '@/common/decorators/require-user.decorator';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(ISPUBLICKEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isUser = this.reflector.getAllAndOverride<boolean>(REQUIRESUSERKEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const user = this.getUserFromRequest(context);

    if (isPublic || isUser) return true;

    if (!(await this.isAdmin(user?.sub))) {
      throw new ForbiddenException('Only Admin can access this resource');
    }

    return true;
  }

  private getUserFromRequest(
    context: ExecutionContext,
  ): { sub: UUID } | undefined {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }

  private async isAdmin(uuid: UUID): Promise<boolean> {
    let user;
    try {
      user = await this.userService.findByUUID(uuid);
      if (!user) throw new BadRequestException('Error Fetching User');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
    return user.isAdmin;
  }
}
