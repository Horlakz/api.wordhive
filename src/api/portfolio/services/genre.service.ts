import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShowcaseGenre } from '../entities/genre.entity';

@Injectable()
export class ShowcaseGenreService {
  constructor(
    @InjectRepository(ShowcaseGenre)
    private showcaseGenreRepository: Repository<ShowcaseGenre>,
  ) {}

  async create(name: string): Promise<ShowcaseGenre> {
    const genre = new ShowcaseGenre();
    genre.name = name;

    const checkGenre = await this.findByName(name);
    if (checkGenre) throw new BadRequestException('Genre already exists');

    return this.showcaseGenreRepository.save(genre);
  }

  async findAll(): Promise<ShowcaseGenre[]> {
    return this.showcaseGenreRepository.find();
  }

  async findByName(name: string): Promise<ShowcaseGenre> {
    return this.showcaseGenreRepository.findOneBy({ name });
  }

  async findOne(uuid: string): Promise<ShowcaseGenre> {
    const genre = await this.showcaseGenreRepository.findOneBy({ uuid });
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.findOne(uuid);
    return this.showcaseGenreRepository.update(uuid, { name: name });
  }

  async remove(uuid: string): Promise<any> {
    await this.findOne(uuid);
    return this.showcaseGenreRepository.softDelete(uuid);
  }
}
