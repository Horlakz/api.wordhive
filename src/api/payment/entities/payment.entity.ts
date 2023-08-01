import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';
import { User } from '@/api/user/entities/user.entity';

@Entity()
export class Payment extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  reference: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column({ enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' })
  status: string;

  @Column({ enum: ['PAYSTACK'], default: 'PAYSTACK' })
  vendor: string;
}
