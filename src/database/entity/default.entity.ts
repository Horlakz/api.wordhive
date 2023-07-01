import {
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DefaultEntity {
  @Generated('increment')
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
