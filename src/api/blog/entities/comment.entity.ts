import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DefaultEntity } from '@/database/entity/default.entity';
import { Blog } from './blog.entity';

@Entity()
export class BlogComment extends DefaultEntity {
  @ManyToOne(() => Blog)
  @JoinColumn()
  blog: Blog;

  @Column()
  fullname: string;

  @Column({ length: 255 })
  message: string;
}
