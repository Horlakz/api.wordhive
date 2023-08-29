import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateServiceDto } from '../dto/create-service.dto';
import { Service } from '../entities/service.entity';
import { CategoryService } from './category.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const category = await this.categoryService.findOne(
      createServiceDto.category,
    );

    const service = new Service();
    service.title = createServiceDto.title;
    service.body = createServiceDto.body;
    service.icon = createServiceDto.icon;
    service.category = category;
    service.volumes = createServiceDto.volumes;

    return await this.serviceRepository.save(service);
  }

  async findAll(name?: string, category?: string, pagination?: PaginationDto) {
    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category');

    if (name) {
      queryBuilder.andWhere('service.title LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (category) {
      queryBuilder.where('category.uuid = :category', { category });
    }

    if (pagination) {
      queryBuilder
        .take(pagination.limit)
        .skip(pagination.limit * (pagination.page - 1));
    }

    const [services, count] = await queryBuilder.getManyAndCount();

    return { services, count };
  }

  async findOne(uuid: string) {
    try {
      const service = await this.serviceRepository.findOneBy({ uuid });
      if (!service) throw new Error('Service not found');

      return service;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(uuid: string) {
    return await this.serviceRepository.softRemove({ uuid });
  }
}
