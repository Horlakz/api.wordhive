import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { BlogService } from './services/blog.service';
import { BlogController } from './controller/blog.controller';
import { BlogCategoryService } from './services/category.service';
import { BlogCategoryController } from './controller/category.controller';
import { BlogCategory } from './entities/category.entity';
import { BlogTag } from './entities/tag.entity';
import { BlogComment } from './entities/comment.entity';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogCategory, BlogTag, BlogComment, Blog]),
  ],
  controllers: [BlogController, BlogCategoryController],
  providers: [BlogService, BlogCategoryService],
})
export class BlogModule {}
