import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';
import { PortfolioField } from './field.entity';
import { PortfolioGenre } from './genre.entity';

@Entity()
export class Portfolio extends BaseEntity {
  @Column()
  title: string;

  @Column({ length: 255 })
  body: string;

  @Column()
  image: string;

  @ManyToMany(() => PortfolioGenre)
  @JoinTable()
  genres: PortfolioGenre[];

  @ManyToOne(() => PortfolioField)
  @JoinColumn()
  field: PortfolioField;
}
