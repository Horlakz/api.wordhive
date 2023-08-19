import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

  @Get('user/:user_id')
  async userOrdersByAdmin(@Param('user_id') userId: string) {
    const orders = this.orderService.findAllByUser(userId);

    return orders;
  }

  @Get('all')
  findAll(@Query('reference') reference: string) {
    return this.orderService.findAll(reference);
  }

  @Get(':reference')
  async findOne(@Param('reference') reference: string) {
    const order = await this.orderService.findOne(reference);

    return order;
  }

  @Public()
  @Get('verify/:reference')
  async verify(@Param('reference') reference: string) {
    const payment = await this.paymentService.verifyPayment(reference);
    const order = await this.orderService.findOneByPaymentReference(reference);

    if (payment.status === 'success') {
      await this.orderService.update(order.uuid, { status: 'CONFIRMED' });
    }

    if (payment.status === 'failed') {
      await this.orderService.update(order.uuid, { status: 'FAILED' });
    }

    return payment;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(@Param('id') id: any, @Body() updateOrderDto: UpdateOrderDto) {
    await this.orderService.update(id, updateOrderDto);

    return { message: 'Order updated successfully' };
  }
}
