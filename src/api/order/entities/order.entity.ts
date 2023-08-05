import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { Payment } from '@/api/payment/entities/payment.entity';
import { Service } from '@/api/service/entities/service.entity';
import { User } from '@/api/user/entities/user.entity';
import { BaseEntity } from '@/database/entity/base.entity';

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
}
