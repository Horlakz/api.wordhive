import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DefaultEntity {
  @Generated('increment')
  @Column()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @AfterLoad()
  async removeIdAndDeletedAt() {
    delete this.id;
    delete this.deleted_at;
  }
}
