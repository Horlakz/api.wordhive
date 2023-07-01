import { DatabaseModule } from '@/database/database.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { RequestLoggingMiddleware } from '@/middleware/logger.middleware';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
