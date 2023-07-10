import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';
import { Blog } from './blog.entity';

@Entity()
export class BlogComment extends BaseEntity {
  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  @JoinColumn()
  blog: Blog;

  @Column()
  fullname: string;

  @Column({ length: 255 })
  message: string;
}
