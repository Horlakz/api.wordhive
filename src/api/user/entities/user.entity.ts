import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;
}
