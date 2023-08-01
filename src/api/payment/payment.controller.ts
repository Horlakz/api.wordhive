import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import * as crypto from 'crypto';
import type { Request } from 'express';

import { Public } from '@/common/decorators/auth.public.decorator';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAll() {
    return await this.paymentService.findAll();
  }

  @Public()
  @Get(':reference')
  async verifyPayment(@Param('reference') reference: string) {
    return await this.paymentService.verifyPayment(reference);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async webhookListener(@Body() body, @Req() req: Request) {
    // const hash = crypto
    //   .createHmac('sha512', this.configService.get('PAYSTACK_SECRET_KEY'))
    //   .update(JSON.stringify(body))
    //   .digest('hex');

    // if (
    //   hash == req.headers['x-paystack-signature'] &&
    //   this.configService.get('NODE_ENV') === 'production'
    // ) {
    //   this.paymentService.verifyPayment(body?.data?.reference);
    // } else {
    //   throw new BadRequestException('Invalid signature');
    // }

    await this.paymentService.verifyPayment(body?.data?.reference);
  }
}
