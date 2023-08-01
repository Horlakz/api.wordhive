import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { Public } from '@/common/decorators/auth.public.decorator';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Public()
  @Get(':reference')
  verifyPayment(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  webhookListener(@Body() body) {
    console.log(body);
    return this.paymentService.verifyPayment(body.data.reference);
  }
}
