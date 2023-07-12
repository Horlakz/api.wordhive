import slugify from 'slugify';
import type { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { Blog as BlogEntity } from '@/api/blog/entities/blog.entity';

@EventSubscriber()
export class BlogSubscriber implements EntitySubscriberInterface<BlogEntity> {
  listenTo(): typeof BlogEntity {
    return BlogEntity;
  }

  beforeInsert(event: InsertEvent<any>): void {
    const blog = event.entity as BlogEntity;
    blog.slug = slugify(blog.title, { lower: true, strict: true });
  }
}
