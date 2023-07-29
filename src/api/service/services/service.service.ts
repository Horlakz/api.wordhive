import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateServiceDto } from '../dto/create-service.dto';
import { Service } from '../entities/service.entity';
import { CategoryService } from './category.service';

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

  async findAll(category?: string) {
    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category');

    if (category) {
      queryBuilder.where('category.uuid = :category', { category });
    }

    const services = await queryBuilder.getMany();

    return services;
  }

  async findOne(uuid: string) {
    const service = await this.serviceRepository.findOneBy({ uuid });
    return service;
  }

  async remove(uuid: string) {
    return await this.serviceRepository.softRemove({ uuid });
  }
}
