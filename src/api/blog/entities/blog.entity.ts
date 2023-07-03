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

import { DefaultEntity } from '@/database/entity/default.entity';
import { BlogCategory } from './category.entity';
import { BlogTag } from './tag.entity';

@Entity()
export class Blog extends DefaultEntity {
  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ length: 255 })
  body: string;

  @ManyToMany(() => BlogTag)
  @JoinTable()
  tags: BlogTag[];

  @ManyToOne(() => BlogCategory)
  @JoinColumn()
  category: BlogCategory;

  @BeforeInsert()
  async slugifyTitle() {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
}
