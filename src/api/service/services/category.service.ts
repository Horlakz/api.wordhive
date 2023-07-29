import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ServiceCategory } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {}

  async create(name: string): Promise<ServiceCategory> {
    const category = new ServiceCategory();
    category.name = name;

    const checkCategory = await this.findByName(name);
    if (checkCategory) throw new BadRequestException('Category already exists');

    return this.serviceCategoryRepository.save(category);
  }

  async findAll(): Promise<ServiceCategory[]> {
    return await this.serviceCategoryRepository.find();
  }

  async findByName(name: string): Promise<ServiceCategory> {
    return await this.serviceCategoryRepository.findOneBy({ name });
  }

  async findOne(uuid: string): Promise<ServiceCategory> {
    const category = await this.serviceCategoryRepository.findOneBy({ uuid });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.findOne(uuid);
    return await this.serviceCategoryRepository.update(uuid, { name: name });
  }

  async remove(uuid: string): Promise<any> {
    await this.findOne(uuid);
    return await this.serviceCategoryRepository.softDelete(uuid);
  }
}
