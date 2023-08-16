import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@Entity()
export class ServiceIcon extends BaseEntity {
  @Column()
  name: string;

  @Column()
  url: string;
}
