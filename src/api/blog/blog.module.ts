import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogController } from './controller/blog.controller';
import { BlogCategoryController } from './controller/category.controller';
import { BlogTagController } from './controller/tag.controller';
import { Blog } from './entities/blog.entity';
import { BlogCategory } from './entities/category.entity';
import { BlogComment } from './entities/comment.entity';
import { BlogTag } from './entities/tag.entity';
import { BlogService } from './services/blog.service';
import { BlogCategoryService } from './services/category.service';
import { BlogTagService } from './services/tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogCategory, BlogTag, BlogComment, Blog]),
  ],
  controllers: [BlogController, BlogCategoryController, BlogTagController],
  providers: [BlogService, BlogCategoryService, BlogTagService],
})
export class BlogModule {}
