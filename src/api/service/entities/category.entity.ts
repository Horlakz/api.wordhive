import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@Entity()
export class ServiceCategory extends BaseEntity {
  @Column()
  name: string;
}
