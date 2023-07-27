import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { BlogComment } from '../entities/comment.entity';
import { BlogService } from './blog.service';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogComment)
    private blogCommentRepository: Repository<BlogComment>,
    private blogService: BlogService,
  ) {}

  async create(
    createcomment: CreateCommentDto,
    blog_slug,
  ): Promise<BlogComment> {
    const blog = await this.blogService.findOneBySlug(blog_slug);

    const comment = new BlogComment();
    comment.fullname = createcomment.fullname;
    comment.message = createcomment.message;
    comment.blog = blog;

    return this.blogCommentRepository.save(comment);
  }

  async findAllByBlog(slug: string): Promise<BlogComment[]> {
    await this.blogService.findOneBySlug(slug);

    return this.blogCommentRepository.find({ where: { blog: { slug } } });
  }
}
