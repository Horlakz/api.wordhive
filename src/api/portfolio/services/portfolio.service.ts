import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MediaService } from '@/api/media/media.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';
import { PortfolioGenre } from '../entities/genre.entity';
import { Portfolio } from '../entities/portfolio.entity';
import { PortfolioFieldService } from './field.service';
import { PortfolioGenreService } from './genre.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    private showcaseGenreService: PortfolioGenreService,
    private showcaseFieldService: PortfolioFieldService,
    private mediaService: MediaService,
  ) {}

  async create(createShowcaseDto: CreatePortfolioDto) {
    const showcase = new Portfolio();
    return this.save(showcase, createShowcaseDto);
  }

  async findAll(
    field?: string,
    genres?: string[],
    paginationDto?: PaginationDto,
  ): Promise<Portfolio[]> {
    const queryBuilder = await this.queryBuilder(field, genres, paginationDto);

    return queryBuilder.getMany();
  }

  async countAll(
    field?: string,
    genres?: string[],
    paginationDto?: PaginationDto,
  ) {
    const queryBuilder = await this.queryBuilder(field, genres, paginationDto);

    return queryBuilder.getCount();
  }

  async findOne(uuid: string) {
    let showcase: Portfolio;
    try {
      showcase = await this.portfolioRepository.findOne({
        where: { uuid },
        relations: { genres: true, field: true },
      });
      if (!showcase) throw new NotFoundException('Showcase not found');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return showcase;
  }

  async update(uuid: string, updateBlogDto: UpdatePortfolioDto) {
    const blog = await this.findOne(uuid);
    return this.save(blog, updateBlogDto);
  }

  async remove(uuid: string) {
    const showcase = await this.findOne(uuid);

    try {
      await this.mediaService.delete(showcase.image);
      await this.portfolioRepository.softDelete({ uuid });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async save(showcase: Portfolio, dto: UpdatePortfolioDto): Promise<Portfolio> {
    let newShowcase: Portfolio;
    let genres: PortfolioGenre[] = [];
    for (let i = 0; i < dto.genre?.length; i++) {
      const tag = await this.showcaseGenreService.findOne(dto.genre[i]);
      if (tag) genres.push(tag);
    }

    const field = await this.showcaseFieldService.findOne(dto.field);
    const image = this.mediaService.generateKey(dto.image.originalname);

    showcase.title = dto.title;
    showcase.body = dto.body;
    showcase.genres = genres;
    showcase.field = field;
    showcase.image = image;

    try {
      await this.mediaService.upload(dto.image);
      newShowcase = await this.portfolioRepository.save(showcase);
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return newShowcase;
  }

  async queryBuilder(
    field?: string,
    genres?: string[],
    paginationDto?: PaginationDto,
  ) {
    const { limit, page } = paginationDto;

    const queryBuilder = await this.portfolioRepository
      .createQueryBuilder('showcase')
      .leftJoinAndSelect('showcase.genre', 'genre')
      .leftJoinAndSelect('showcase.field', 'field');

    if (field) {
      queryBuilder.where('field.uuid = :field', { field });
    }

    if (genres && genres.length > 0) {
      queryBuilder
        .leftJoin('showcase.genre', 'genre')
        .andWhere('genre.uuid IN (:...genre)', { genres });
    }

    if (limit && page) {
      queryBuilder.take(limit).skip(limit * (page - 1));
    }

    return queryBuilder;
  }
}
