import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PortfolioGenre } from '../entities/genre.entity';

@Injectable()
export class PortfolioGenreService {
  constructor(
    @InjectRepository(PortfolioGenre)
    private portfolioGenreRepository: Repository<PortfolioGenre>,
  ) {}

  async create(name: string): Promise<PortfolioGenre> {
    const genre = new PortfolioGenre();
    genre.name = name;

    const checkGenre = await this.findByName(name);
    if (checkGenre) throw new BadRequestException('Genre already exists');

    return this.portfolioGenreRepository.save(genre);
  }

  async findAll(): Promise<PortfolioGenre[]> {
    return this.portfolioGenreRepository.find();
  }

  async findByName(name: string): Promise<PortfolioGenre> {
    return this.portfolioGenreRepository.findOneBy({ name });
  }

  async findOne(uuid: string): Promise<PortfolioGenre> {
    const genre = await this.portfolioGenreRepository.findOneBy({ uuid });
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }

  async update(uuid: string, name: string): Promise<any> {
    await this.findOne(uuid);
    return this.portfolioGenreRepository.update(uuid, { name: name });
  }

  async remove(uuid: string): Promise<any> {
    await this.findOne(uuid);
    return this.portfolioGenreRepository.softDelete(uuid);
  }
}
