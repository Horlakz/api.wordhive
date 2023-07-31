import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@Entity()
export class PortfolioGenre extends BaseEntity {
  @Column()
  name: string;
}
