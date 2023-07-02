import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogComment } from '../entities/comment.entity';
import { Blog } from '../entities/blog.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogComment)
    private blogCommentRepository: Repository<BlogComment>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(createcomment: CreateCommentDto, blog_id): Promise<BlogComment> {
    const blog = await this.blogRepository.findOneBy({
      uuid: blog_id,
    });
    if (!blog) throw new NotFoundException('Blog not found');

    const comment = new BlogComment();
    comment.fullname = createcomment.fullname;
    comment.message = createcomment.message;
    comment.blog_id = blog;

    return this.blogCommentRepository.save(comment);
  }

  async findAllByBlog(uuid: string): Promise<BlogComment[]> {
    const blog = await this.blogRepository.findOneBy({ uuid });
    if (!blog) throw new NotFoundException('Blog not found');

    return this.blogCommentRepository.findBy({ blog_id: blog });
  }
}
