import { Entity, Column } from 'typeorm';

import { DefaultEntity } from '@/database/entity/default.entity';

@Entity()
export class User extends DefaultEntity {
  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;
}
