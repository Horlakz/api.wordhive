import slugify from 'slugify';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';
import { ShowcaseField } from './field.entity';
import { ShowcaseGenre } from './genre.entity';

@Entity()
export class Showcase extends BaseEntity {
  @Column()
  title: string;

  @Column({ length: 255 })
  body: string;

  @Column()
  image: string;

  @ManyToMany(() => ShowcaseGenre)
  @JoinTable()
  genre: ShowcaseGenre[];

  @ManyToOne(() => ShowcaseField)
  @JoinColumn()
  field: ShowcaseField;
}
