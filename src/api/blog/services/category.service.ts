import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogCategory } from '../entities/category.entity';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private blogCategoryRepository: Repository<BlogCategory>,
  ) {}

  async create(name: string): Promise<BlogCategory> {
    const category = new BlogCategory();
    category.name = name;

    const checkCategory = await this.findByName(name);
    if (checkCategory) throw new BadRequestException('Category already exists');

    return this.blogCategoryRepository.save(category);
  }

  async findAll(): Promise<BlogCategory[]> {
    return this.blogCategoryRepository.find();
  }

  async findByName(name: string): Promise<BlogCategory> {
    return this.blogCategoryRepository.findOneBy({ name });
  }

  async findOne(uuid: string): Promise<BlogCategory> {
    const category = await this.blogCategoryRepository.findOneBy({ uuid });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.findOne(uuid);
    return this.blogCategoryRepository.update(uuid, { name: name });
  }

  async remove(uuid: string): Promise<any> {
    await this.findOne(uuid);
    return this.blogCategoryRepository.softDelete(uuid);
  }
}
