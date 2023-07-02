import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';

import { DefaultEntity } from '@/database/entity/default.entity';
import { BlogCategory } from './category.entity';
import { BlogTag } from './tag.entity';

@Entity()
export class Blog extends DefaultEntity {
  @Column()
  title: string;

  @Column({ length: 255 })
  body: string;

  @ManyToMany(() => BlogTag)
  @JoinTable()
  tags: BlogTag[];

  @OneToOne(() => BlogCategory)
  @JoinColumn()
  category: BlogCategory;
}
