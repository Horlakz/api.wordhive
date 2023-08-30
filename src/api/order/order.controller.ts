import {
  BadRequestException,
  Body,
  Controller,
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
import { Public } from '@/common/decorators/auth.public.decorator';
import { RequiresUser } from '@/common/decorators/require-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { PaginationResponseDto } from '@/common/dto/paginationResponse.dto';
import { Order } from './entities/order.entity';

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
  async findAll(
    @Query('reference') reference: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const [orders, total] = await this.orderService.findAll(reference, {
      page,
      limit,
    });

    const response: PaginationResponseDto<Order> = {
      results: orders as Order[],
      pagination: {
        total: +total,
        page,
        limit,
        totalPages: Math.ceil(+total / limit),
      },
    };

    return response;
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

  @Public()
  @Patch('confirm-delivery/:id')
  async confirmDelivery(@Param('id') id: string) {
    const order = await this.orderService.findOneById(id);

    if (order.status !== 'COMPLETED') {
      throw new BadRequestException('Order is not completed');
    }

    await this.orderService.update(id, { status: 'DELIVERED' });

    return { message: 'Order updated successfully' };
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    await this.orderService.update(id, updateOrderDto);

    return { message: 'Order updated successfully' };
  }
}
