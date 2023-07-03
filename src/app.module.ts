import { DatabaseModule } from '@/database/database.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { RequestLoggingMiddleware } from '@/middleware/logger.middleware';
import { AuthGuard } from '@/api/auth/auth.guard';
import { AuthModule } from '@/api/auth/auth.module';
import { UsersModule } from '@/api/users/users.module';
import { BlogModule } from '@/api/blog/blog.module';
import { FaqModule } from './api/faq/faq.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BlogModule,
    FaqModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
