import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateShowcaseDto } from '../dto/create-showcase.dto';
import { UpdateShowcaseDto } from '../dto/update-showcase.dto';
import { Showcase } from '../entities/showcase.entity';
import { ShowcaseGenre } from '../entities/genre.entity';
import { ShowcaseFieldService } from './field.service';
import { ShowcaseGenreService } from './genre.service';
import { AwsS3Service } from '@/config/aws/aws_s3.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class ShowcaseService {
  constructor(
    @InjectRepository(Showcase)
    private showcaseRepository: Repository<Showcase>,
    private showcaseGenreService: ShowcaseGenreService,
    private showcaseFieldService: ShowcaseFieldService,
    private awsService: AwsS3Service,
  ) {}

  async create(createShowcaseDto: CreateShowcaseDto) {
    const showcase = new Showcase();
    return this.save(showcase, createShowcaseDto);
  }

  async findAll(
    field?: string,
    genres?: string[],
    paginationDto?: PaginationDto,
  ): Promise<Showcase[]> {
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
    let showcase: Showcase;
    try {
      showcase = await this.showcaseRepository.findOne({
        where: { uuid },
        relations: { genre: true, field: true },
      });
      if (!showcase) throw new NotFoundException('Showcase not found');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return showcase;
  }

  // async findOneBySlug(slug: string) {
  //   const blog = await this.showcaseRepository.findOne({
  //     where: { slug },
  //     relations: { tags: true, category: true },
  //   });
  //   if (!blog) throw new NotFoundException('Blog not found');
  //   return blog;
  // }

  async update(uuid: string, updateBlogDto: UpdateShowcaseDto) {
    const blog = await this.findOne(uuid);
    return this.save(blog, updateBlogDto);
  }

  async remove(uuid: string) {
    const showcase = await this.findOne(uuid);

    try {
      await this.awsService.delete(showcase.image);
      await this.showcaseRepository.softDelete({ uuid });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async save(showcase: Showcase, dto: UpdateShowcaseDto): Promise<Showcase> {
    let newShowcase: Showcase;
    let genres: ShowcaseGenre[] = [];
    for (let i = 0; i < dto.genre?.length; i++) {
      const tag = await this.showcaseGenreService.findOne(dto.genre[i]);
      if (tag) genres.push(tag);
    }

    const field = await this.showcaseFieldService.findOne(dto.field);
    const image = this.awsService.generateKey(dto.image.originalname);

    showcase.title = dto.title;
    showcase.body = dto.body;
    showcase.genre = genres;
    showcase.field = field;
    showcase.image = image;

    try {
      await this.awsService.upload(dto.image);
      newShowcase = await this.showcaseRepository.save(showcase);
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

    const queryBuilder = await this.showcaseRepository
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
