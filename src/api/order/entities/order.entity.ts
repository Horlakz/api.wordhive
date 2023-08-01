import { Entity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';
import { Payment } from '@/api/payment/entities/payment.entity';
import { User } from '@/api/user/entities/user.entity';
import { Service } from '@/api/service/entities/service.entity';

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
    enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  })
  status: string;
}
