import type { EntitySubscriberInterface, LoadEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { BaseEntity } from '../entity/base.entity';

@EventSubscriber()
export class BaseSubscriber implements EntitySubscriberInterface<BaseEntity> {
  afterInsert(event: LoadEvent<BaseEntity>): void {
    delete event.entity.id;
    delete event.entity.deleted_at;
  }
}
