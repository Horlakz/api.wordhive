import { BadRequestException, Injectable } from '@nestjs/common';
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
    return this.blogCategoryRepository.findOneBy({ uuid });
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.checkCategoryExists(uuid);
    return this.blogCategoryRepository.update(uuid, { name: name });
  }

  async remove(uuid: string): Promise<any> {
    await this.checkCategoryExists(uuid);
    return this.blogCategoryRepository.softDelete(uuid);
  }

  async checkCategoryExists(uuid: string): Promise<boolean> {
    const category = await this.findOne(uuid);
    if (!category) throw new BadRequestException('Category not found');

    return true;
  }
}
