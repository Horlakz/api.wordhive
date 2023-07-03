import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogController } from './controllers/blog.controller';
import { BlogCategoryController } from './controllers/category.controller';
import { BlogCommentController } from './controllers/comment.controller';
import { BlogTagController } from './controllers/tag.controller';
import { Blog } from './entities/blog.entity';
import { BlogCategory } from './entities/category.entity';
import { BlogComment } from './entities/comment.entity';
import { BlogTag } from './entities/tag.entity';
import { BlogService } from './services/blog.service';
import { BlogCategoryService } from './services/category.service';
import { BlogCommentService } from './services/comment.service';
import { BlogTagService } from './services/tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogCategory, BlogTag, BlogComment, Blog]),
  ],
  controllers: [
    BlogController,
    BlogCategoryController,
    BlogTagController,
    BlogCommentController,
  ],
  providers: [
    BlogService,
    BlogCategoryService,
    BlogTagService,
    BlogCommentService,
  ],
})
export class BlogModule {}
