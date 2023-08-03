import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
  AfterUpdate,
} from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';
import { Payment } from '@/api/payment/entities/payment.entity';
import { User } from '@/api/user/entities/user.entity';
import { Service } from '@/api/service/entities/service.entity';

interface StatusDetails<T> {
  name: T;
  status: boolean;
  timestamp: Date;
}

// interface Status {
//   awaitingConfirmation: StatusDetails<'Awaiting Confirmation'>;
//   workInProgress: StatusDetails<'Work in Progress'>;
//   sentOut: StatusDetails<'Out for delivery'>;
//   delivered: StatusDetails<'Delivered'>;
// }

@Entity()
export class Order extends BaseEntity {
  @Column()
  reference: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Payment)
  @JoinColumn({ name: 'payment_info' })
  paymentInfo: Payment;

  @ManyToOne(() => Service)
  @JoinColumn()
  service: Service;

  @Column({ name: 'service_volume' })
  serviceVolume: string;

  @Column({ name: 'service_quality' })
  serviceQuality: string;

  @Column({ name: 'service_price' })
  price: number;

  @Column({
    enum: [
      'PENDING',
      'CONFIRMED',
      'IN_PROGRESS',
      'COMPLETED',
      'DELIVERED',
      'FAILED',
    ],
    default: 'PENDING',
  })
  status: string;

  @Column({
    name: 'awaiting_confirmation',
    type: 'jsonb',
    default: { name: 'Awaiting Confirmation', status: false },
  })
  awaitingConfirmation: StatusDetails<'Awaiting Confirmation'>;

  @Column({
    name: 'work_in_progress',
    type: 'jsonb',
    default: { name: 'Work in Progress', status: false },
  })
  workInProgress: StatusDetails<'Work in Progress'>;

  @Column({
    name: 'out_for_delivery',
    type: 'jsonb',
    default: { name: 'Out for delivery', status: false },
  })
  sentOut: StatusDetails<'Out for delivery'>;

  @Column({
    name: 'delivered',
    type: 'jsonb',
    default: { name: 'Delivered', status: false },
  })
  delivered: StatusDetails<'Delivered'>;

  @AfterUpdate()
  updateStatus() {
    const date = new Date();
    switch (this.status) {
      case 'CONFIRMED':
        this.awaitingConfirmation = {
          name: 'Awaiting Confirmation',
          status: true,
          timestamp: date,
        };
        break;
      case 'IN_PROGRESS':
        this.workInProgress = {
          name: 'Work in Progress',
          status: true,
          timestamp: date,
        };
        break;

      case 'COMPLETED':
        this.sentOut = {
          name: 'Out for delivery',
          status: true,
          timestamp: date,
        };
        break;
      case 'DELIVERED':
        this.delivered = {
          name: 'Delivered',
          status: true,
          timestamp: date,
        };
        break;
      default:
        this.awaitingConfirmation = {
          name: 'Awaiting Confirmation',
          status: false,
          timestamp: date,
        };
    }
  }
}
