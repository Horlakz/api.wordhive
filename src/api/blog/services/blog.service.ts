import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogComment } from '../entities/comment.entity';
import { BlogCategory } from '../entities/category.entity';
import { BlogTag } from '../entities/tag.entity';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class BlogService {
  constructor() // @InjectRepository(Blog)
  // private blogRepository: Repository<Blog>,
  // @InjectRepository(BlogComment)
  // private blogCommentRepository: Repository<BlogComment>,
  // @InjectRepository(BlogTag)
  // private blogTagRepository: Repository<BlogTag>,
  {}

  // createTag(name: string) {
  //   const tag = new BlogTag();
  //   tag.name = name;

  //   return this.blogTagRepository.save(tag);
  // }

  // async createComment(body: string, blog_id: string) {
  //   const blog = await this.findOneBlog(blog_id);
  //   if (!blog) throw new NotFoundException('Blog not found');

  //   const comment = new BlogComment();

  //   comment.message = body;
  //   comment.blog_id = blog;

  //   return this.blogCommentRepository.save(comment);
  // }

  create(createBlogDto: CreateBlogDto) {
    return 'This action adds a new blog';
  }

  findAll() {
    return `This action returns all blog`;
  }

  // async findOneBlog(id: string) {
  //   return this.blogRepository.findOneBy({ uuid: id });
  // }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
