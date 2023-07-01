import { Entity, Column } from 'typeorm';

import { DefaultEntity } from '@/database/entity/default.entity';

@Entity()
export class BlogTag extends DefaultEntity {
  @Column()
  name: string;
}
