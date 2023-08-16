import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ServiceIcon } from '../entities/icon.entity';
import { MediaService } from '@/api/media/media.service';
import { CreateIconDto } from '../dto/create-icon.dto';

@Injectable()
export class IconService {
  constructor(
    @InjectRepository(ServiceIcon)
    private readonly serviceIconRepository: Repository<ServiceIcon>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createIcon: CreateIconDto): Promise<ServiceIcon> {
    const icon = new ServiceIcon();
    const url = await this.mediaService.upload(createIcon.file);
    icon.name = createIcon.name;
    icon.url = url;

    return this.serviceIconRepository.save(icon);
  }

  async findAll(): Promise<ServiceIcon[]> {
    return await this.serviceIconRepository.find();
  }

  async findOne(uuid: string): Promise<ServiceIcon> {
    const icon = await this.serviceIconRepository.findOneBy({ uuid });
    if (!icon) throw new NotFoundException('Icon not found');
    return icon;
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.findOne(uuid);
    return await this.serviceIconRepository.update(uuid, { name });
  }

  async remove(uuid: string): Promise<any> {
    const icon = await this.findOne(uuid);
    return await this.serviceIconRepository.softRemove(icon);
  }
}
