import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { User as UserEntity } from '@/api/user/entities/user.entity';
import { AppUtilities } from '@/app.utilities';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    const user = event.entity as UserEntity;
    if (user.password) {
      user.password = await AppUtilities.generateHash(user.password);
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    const user = event.entity as UserEntity;

    if (user.password !== event.databaseEntity.password) {
      user.password = await AppUtilities.generateHash(user.password);
    }
  }
}
