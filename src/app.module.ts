import { DatabaseModule } from '@/database/database.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '@/api/auth/auth.module';
import { BlogModule } from '@/api/blog/blog.module';
import { ContactModule } from '@/api/contact/contact.module';
import { FaqModule } from '@/api/faq/faq.module';
import { MediaModule } from '@/api/media/media.module';
import { OrderModule } from '@/api/order/order.module';
import { PaymentModule } from '@/api/payment/payment.module';
import { PortfolioModule } from '@/api/portfolio/portfolio.module';
import { ServiceModule } from '@/api/service/service.module';
import { UserModule } from '@/api/user/user.module';
import { AuthGuard } from '@/guards/auth.guard';
import { UserGuard } from '@/guards/user.guard';
import { RequestLoggingMiddleware } from '@/middleware/logger.middleware';
import { SharedModule } from '@/shared/shared.module';
import { ValidationPipe } from '@/validation/validation.pipe';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    BlogModule,
    FaqModule,
    ContactModule,
    PortfolioModule,
    MediaModule,
    SharedModule,
    ServiceModule,
    OrderModule,
    PaymentModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: UserGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
