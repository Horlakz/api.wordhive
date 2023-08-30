import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { Blog } from '../entities/blog.entity';
import { BlogTag } from '../entities/tag.entity';
import { BlogCategoryService } from './category.service';
import { BlogTagService } from './tag.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private blogTagService: BlogTagService,
    private blogCategoryService: BlogCategoryService,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const blog = new Blog();
    return this.save(blog, createBlogDto);
  }

  findAll(
    search?: string,
    category?: string,
    tags?: string[],
    pagination?: PaginationDto,
  ) {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoinAndSelect('blog.category', 'category');

    if (search) {
      queryBuilder.where('blog.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category) {
      queryBuilder.where('category.uuid = :category', { category });
    }

    if (tags && tags.length > 0) {
      queryBuilder
        .leftJoin('blog.tags', 'tag')
        .andWhere('tags.uuid IN (:...tags)', { tags });
    }

    if (pagination) {
      const { limit, page } = pagination;
      queryBuilder.take(limit).skip((page - 1) * limit);
    }

    return queryBuilder.getManyAndCount();
  }

  async findOne(uuid: string) {
    let blog: Blog;
    try {
      blog = await this.blogRepository.findOne({
        where: { uuid },
        relations: { tags: true, category: true },
      });
      if (!blog) throw new NotFoundException('Blog not found');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return blog;
  }

  async findOneBySlug(slug: string) {
    const blog = await this.blogRepository.findOne({
      where: { slug },
      relations: { tags: true, category: true },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(uuid: string, updateBlogDto: UpdateBlogDto) {
    const blog = await this.findOne(uuid);
    return this.save(blog, updateBlogDto);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.blogRepository.softDelete({ uuid });
  }

  async save(blog: Blog, dto: UpdateBlogDto): Promise<Blog> {
    let newBlog: Blog;
    let tags: BlogTag[] = [];
    for (let i = 0; i < dto.tags?.length; i++) {
      const tag = await this.blogTagService.findOne(dto.tags[i]);
      if (tag) tags.push(tag);
    }

    const category = await this.blogCategoryService.findOne(dto.category);

    blog.title = dto.title;
    blog.body = dto.body;
    blog.tags = tags;
    blog.category = category;

    try {
      newBlog = await this.blogRepository.save(blog);
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return newBlog;
  }
}
