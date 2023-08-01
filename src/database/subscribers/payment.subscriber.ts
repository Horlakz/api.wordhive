import type { EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { Order as OrderEntity } from '@/api/order/entities/order.entity';
import { Payment as PaymentEntity } from '@/api/payment/entities/payment.entity';

@EventSubscriber()
export class PaymentSubscriber
  implements EntitySubscriberInterface<PaymentEntity | OrderEntity>
{
  listenTo(): typeof PaymentEntity {
    return PaymentEntity;
  }

  async afterUpdate(event: UpdateEvent<PaymentEntity>): Promise<any> {
    try {
      await event.queryRunner.manager.findOne(OrderEntity, {
        where: { paymentInfo: event.entity },
      });
    } catch (error) {
      if (error.name === 'QueryRunnerAlreadyReleasedError') {
        console.log('query runner already released');
        event.queryRunner = event.connection.createQueryRunner();
        await event.queryRunner.connect();
      } else {
        throw error;
      }
    }

    const payment = event.entity as PaymentEntity;
    const order = await event.queryRunner.manager.findOne(OrderEntity, {
      where: { paymentInfo: payment },
    });

    if (payment.status === 'SUCCESS') {
      order.status = 'PROCESSING';
      await event.queryRunner.manager.save(order);
    }

    if (payment.status === 'FAILED') {
      order.status = 'FAILED';
      await event.queryRunner.manager.save(order);
    }

    await event.queryRunner.release();
  }
}
