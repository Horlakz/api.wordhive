import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@Entity()
export class Faq extends BaseEntity {
  @Column()
  question: string;

  @Column()
  answer: string;
}
