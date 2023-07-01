import { Entity, Column } from 'typeorm';

import { DefaultEntity } from '@/database/entity/default.entity';

@Entity()
export class BlogCategory extends DefaultEntity {
  @Column()
  name: string;
}
