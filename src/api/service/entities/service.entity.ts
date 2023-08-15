import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';
import { ServiceCategory } from './category.entity';

@Entity()
export class Service extends BaseEntity {
  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  icon: string;

  @ManyToOne(() => ServiceCategory, { onDelete: 'CASCADE' })
  @JoinColumn()
  category: ServiceCategory;

  @Column({ type: 'jsonb' })
  volumes: Volume[];
}

interface Volume {
  name: string;
  qualities: Quality[];
}

interface Quality {
  type: string;
  price: number;
}
