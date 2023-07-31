import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PortfolioField } from '../entities/field.entity';

@Injectable()
export class PortfolioFieldService {
  constructor(
    @InjectRepository(PortfolioField)
    private porfolioFieldRepository: Repository<PortfolioField>,
  ) {}

  async create(name: string): Promise<PortfolioField> {
    const field = new PortfolioField();
    field.name = name;

    const checkField = await this.findByName(name);
    if (checkField) throw new BadRequestException('Field already exists');

    return this.porfolioFieldRepository.save(field);
  }

  async findAll(): Promise<PortfolioField[]> {
    return this.porfolioFieldRepository.find();
  }

  async findByName(name: string): Promise<PortfolioField> {
    return this.porfolioFieldRepository.findOneBy({ name });
  }

  async findOne(uuid: string): Promise<PortfolioField> {
    const field = await this.porfolioFieldRepository.findOneBy({ uuid });
    if (!field) throw new NotFoundException('Field not found');
    return field;
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.findOne(uuid);
    return this.porfolioFieldRepository.update(uuid, { name: name });
  }

  async remove(uuid: string): Promise<any> {
    await this.findOne(uuid);
    return this.porfolioFieldRepository.softDelete(uuid);
  }
}
