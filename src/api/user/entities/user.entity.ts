import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;
}
