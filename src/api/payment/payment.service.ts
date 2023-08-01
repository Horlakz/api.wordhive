import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaystackService } from '@/shared/services/paystack.service';
import { User } from '@/api/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private paystackService: PaystackService,
    private configService: ConfigService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: User, url: string) {
    const newPayment = new Payment();
    newPayment.amount = createPaymentDto.amount;
    newPayment.description = createPaymentDto.description;
    newPayment.reference = createPaymentDto.reference;
    newPayment.user = user;

    try {
      const initialize = await this.initializePayment({
        email: user.email,
        amount: createPaymentDto.amount,
        reference: createPaymentDto.reference,
        callback_url: this.configService.get('FRONTEND_BASE_URL') + url,
      });

      const payment = await this.paymentRepository.save(newPayment);

      return { redirectLink: initialize.data.authorization_url, payment };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  findAll() {
    return this.queryBuilder().getMany();
  }

  async findOne(id: string) {
    try {
      const payment = await this.queryBuilder().where('payment.uuid = :id', {
        id,
      });

      return payment.getOne();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findByReference(reference: string) {
    try {
      const payment = await this.queryBuilder().where(
        'payment.reference = :reference',
        { reference },
      );

      return payment.getOne();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.findOne(id);

      if (!payment) {
        throw new BadRequestException('Payment not found');
      }
      await this.paymentRepository.update({ uuid: id }, updatePaymentDto);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyPayment(
    reference: string,
  ): Promise<{ status: 'success' | 'failed' | 'abandoned'; message: string }> {
    const payment = await this.findByReference(reference);

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    const verify = await this.paystackService.verify(reference);

    if (verify.data.status === 'success') {
      await this.update(payment.uuid, { status: 'SUCCESS' });

      return { status: 'success', message: 'Payment is successful' };
    } else if (verify.data.status === 'failed') {
      await this.update(payment.uuid, { status: 'FAILED' });

      return { status: 'failed', message: 'Payment failed' };
    }

    return {
      status: verify.data.status,
      message: verify.data.gateway_response,
    };
  }

  async initializePayment(data) {
    return await this.paystackService.initialize(data);
  }

  queryBuilder() {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .select(['payment', 'user.fullname', 'user.email']);

    return queryBuilder;
  }
}

// wisdom complained about our names we put in footer
