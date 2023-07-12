import type { EntitySubscriberInterface } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { BaseEntity } from '@/database/entity/base.entity';

@EventSubscriber()
export class BaseSubscriber implements EntitySubscriberInterface<BaseEntity> {
  afterLoad(entity: BaseEntity): void | Promise<any> {
    delete entity.id;
    delete entity.deleted_at;
  }
}
