import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';
import { User } from './user.entity';

@Entity()
export class VerificationCode extends BaseEntity {
  @Column()
  code: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: User;
}
