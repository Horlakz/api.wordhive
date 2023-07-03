import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@Entity()
export class BlogTag extends BaseEntity {
  @Column()
  name: string;
}
