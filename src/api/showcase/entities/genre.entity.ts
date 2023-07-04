import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@Entity()
export class ShowcaseGenre extends BaseEntity {
  @Column()
  name: string;
}
