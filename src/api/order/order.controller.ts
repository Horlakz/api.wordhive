import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { PaymentService } from '@/api/payment/payment.service';
import { RequiresUser } from '@/common/decorators/require-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { Public } from '@/common/decorators/auth.public.decorator';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @RequiresUser()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.orderService.create(createOrderDto, req.user.sub);
  }

  @RequiresUser()
  @Get()
  async userOrders(@Req() req) {
    const userId = req.user.sub;
    const orders = this.orderService.findAllByUser(userId);

    return orders;
  }

  @Get('all')
  findAll(@Query('reference') reference: string) {
    return this.orderService.findAll(reference);
  }

  @Public()
  @Get('verify/:reference')
  async verify(@Param('reference') reference: string) {
    const payment = await this.paymentService.verifyPayment(reference);
    const order = await this.orderService.findOneByPaymentReference(reference);

    if (payment.status === 'success') {
      await this.orderService.update(order.uuid, { status: 'PROCESSING' });
    }

    if (payment.status === 'failed') {
      await this.orderService.update(order.uuid, { status: 'FAILED' });
    }

    return payment;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }
}
