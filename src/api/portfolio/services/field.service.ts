import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShowcaseField } from '../entities/field.entity';

@Injectable()
export class ShowcaseFieldService {
  constructor(
    @InjectRepository(ShowcaseField)
    private showcaseFieldRepository: Repository<ShowcaseField>,
  ) {}

  async create(name: string): Promise<ShowcaseField> {
    const field = new ShowcaseField();
    field.name = name;

    const checkField = await this.findByName(name);
    if (checkField) throw new BadRequestException('Field already exists');

    return this.showcaseFieldRepository.save(field);
  }

  async findAll(): Promise<ShowcaseField[]> {
    return this.showcaseFieldRepository.find();
  }

  async findByName(name: string): Promise<ShowcaseField> {
    return this.showcaseFieldRepository.findOneBy({ name });
  }

  async findOne(uuid: string): Promise<ShowcaseField> {
    const field = await this.showcaseFieldRepository.findOneBy({ uuid });
    if (!field) throw new NotFoundException('Field not found');
    return field;
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.findOne(uuid);
    return this.showcaseFieldRepository.update(uuid, { name: name });
  }

  async remove(uuid: string): Promise<any> {
    await this.findOne(uuid);
    return this.showcaseFieldRepository.softDelete(uuid);
  }
}
