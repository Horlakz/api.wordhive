import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentService } from '@/api/payment/payment.service';
import { ServiceService } from '@/api/service/services/service.service';
import { UserService } from '@/api/user/services/user.service';
import { AppUtilities } from '@/app.utilities';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private paymentService: PaymentService,
    private userService: UserService,
    private serviceService: ServiceService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user_id) {
    const paymentReference = AppUtilities.generateRandomString(12);
    const orderReference = `SVC_${AppUtilities.generateRandomString(12)}`;

    try {
      const user = await this.userService.findByUUID(user_id);
      const { serviceId, serviceVolume, serviceQuality } = createOrderDto;
      const service = await this.serviceService.findOne(serviceId);

      // get price from service
      const price = service.volumes
        .find((vol) => vol.name === serviceVolume)
        .qualities.find((qual) => qual.type === serviceQuality).price;

      const { redirectLink, payment } = await this.paymentService.create(
        {
          amount: price * 1000,
          description: '',
          reference: paymentReference,
        },
        user,
        '/services/confirm-order',
      );

      const order = new Order();
      order.paymentInfo = payment;
      order.price = price;
      order.reference = orderReference;
      order.service = service;
      order.serviceQuality = serviceQuality;
      order.serviceVolume = serviceVolume;
      order.user = user;

      await this.orderRepository.save(order);
      return { payment_link: redirectLink, order_reference: orderReference };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(reference?: string) {
    const queryBuilder = this.queryBuilder();

    if (reference) {
      queryBuilder.where('reference = :reference', { reference });
    }

    return await queryBuilder.getMany();
  }

  async findAllByUser(user_id: string) {
    const queryBuilder = this.queryBuilder();

    queryBuilder.where('user.uuid = :user_id', { user_id });

    return await queryBuilder.getMany();
  }

  async findOne(reference: string) {
    const queryBuilder = this.queryBuilder();

    queryBuilder.where('order.reference = :reference', { reference });

    return await queryBuilder.getOne();
  }

  async findOneById(id: string) {
    const queryBuilder = this.queryBuilder();

    queryBuilder.where('order.uuid = :id', { id });

    return await queryBuilder.getOne();
  }

  async findOneByPaymentReference(reference: string) {
    const queryBuilder = this.queryBuilder();

    queryBuilder.where('paymentInfo.reference = :reference', { reference });

    return await queryBuilder.getOne();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.updateEntityWithStatus(id, updateOrderDto.status);
    await this.orderRepository.update({ uuid: id }, updateOrderDto);
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }

  queryBuilder() {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.service', 'service')
      .leftJoinAndSelect('order.paymentInfo', 'paymentInfo')
      .select([
        'order',
        'user.fullname',
        'user.email',
        'paymentInfo.reference',
        'paymentInfo.amount',
        'paymentInfo.status',
        'service.title',
        'service.body',
      ])
      .orderBy('order.created_at', 'DESC');

    return queryBuilder;
  }

  async updateEntityWithStatus(id: string, status: string) {
    const order = await this.orderRepository.findOneBy({ uuid: id });

    const date = new Date();
    switch (status) {
      case 'CONFIRMED':
        order.awaitingConfirmation = {
          name: 'Awaiting Confirmation',
          status: true,
          timestamp: date,
        };
        this.orderRepository.save(order);
        break;
      case 'IN_PROGRESS':
        order.workInProgress = {
          name: 'Work in Progress',
          status: true,
          timestamp: date,
        };
        this.orderRepository.save(order);
        break;
      case 'COMPLETED':
        order.sentOut = {
          name: 'Out for delivery',
          status: true,
          timestamp: date,
        };
        this.orderRepository.save(order);
        break;
      case 'DELIVERED':
        order.delivered = {
          name: 'Delivered',
          status: true,
          timestamp: date,
        };
        this.orderRepository.save(order);
        break;
      default:
        order.awaitingConfirmation = {
          name: 'Awaiting Confirmation',
          status: false,
          timestamp: date,
        };
        this.orderRepository.save(order);
        break;
    }
  }
}
