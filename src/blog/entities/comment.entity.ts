import { Entity, Column, ManyToOne } from 'typeorm';

import { DefaultEntity } from '@/database/entity/default.entity';
import { Blog } from './blog.entity';

@Entity()
export class BlogComment extends DefaultEntity {
  @ManyToOne(() => Blog)
  blog_id: Blog;

  @Column()
  fullname: string;

  @Column({ length: 255 })
  message: string;
}
