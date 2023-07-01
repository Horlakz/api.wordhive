import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogTag } from '../entities/tag.entity';

@Injectable()
export class BlogTagService {
  constructor(
    @InjectRepository(BlogTag)
    private blogTagRepository: Repository<BlogTag>,
  ) {}

  async create(name: string): Promise<BlogTag> {
    const tag = new BlogTag();
    tag.name = name;

    const checkTag = await this.findByName(name);
    if (checkTag) throw new BadRequestException('Tag already exists');

    return this.blogTagRepository.save(tag);
  }

  async findAll(): Promise<BlogTag[]> {
    return this.blogTagRepository.find();
  }

  async findByName(name: string): Promise<BlogTag> {
    return this.blogTagRepository.findOneBy({ name });
  }

  async findOne(uuid: string): Promise<BlogTag> {
    return this.blogTagRepository.findOneBy({ uuid });
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.checkTagExists(uuid);
    return this.blogTagRepository.update(uuid, { name: name });
  }

  async remove(uuid: string): Promise<any> {
    await this.checkTagExists(uuid);
    return this.blogTagRepository.softDelete(uuid);
  }

  async checkTagExists(uuid: string): Promise<boolean> {
    const tag = await this.findOne(uuid);
    if (!tag) throw new BadRequestException('Tag not found');

    return true;
  }
}
