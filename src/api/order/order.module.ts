import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentModule } from '@/api/payment/payment.module';
import { ServiceModule } from '@/api/service/service.module';
import { UserModule } from '@/api/user/user.module';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    PaymentModule,
    UserModule,
    ServiceModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
