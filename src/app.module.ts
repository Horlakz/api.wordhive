import { DatabaseModule } from '@/database/database.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from '@/api/auth/auth.guard';
import { AuthModule } from '@/api/auth/auth.module';
import { BlogModule } from '@/api/blog/blog.module';
import { ContactModule } from '@/api/contact/contact.module';
import { FaqModule } from '@/api/faq/faq.module';
import { MediaModule } from '@/api/media/media.module';
import { ShowcaseModule } from '@/api/showcase/showcase.module';
import { UsersModule } from '@/api/users/users.module';
import { RequestLoggingMiddleware } from '@/middleware/logger.middleware';
import { SharedModule } from '@/shared/shared.module';
import { ValidationPipe } from '@/validation/validation.pipe';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BlogModule,
    FaqModule,
    ContactModule,
    ShowcaseModule,
    MediaModule,
    SharedModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
