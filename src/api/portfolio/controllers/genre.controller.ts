import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { Public } from '@/common/decorators/auth.public.decorator';
import { PortfolioGenreService } from '../services/genre.service';

@Controller('portfolio-genre')
export class PortfolioGenreController {
  constructor(private readonly portfolioGenreService: PortfolioGenreService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createGenreDto: { name: string }) {
    if (!createGenreDto.name)
      throw new BadRequestException('Genre Name is required');
    await this.portfolioGenreService.create(createGenreDto.name);

    return { message: 'Genre created successfully' };
  }

  @Public()
  @Get()
  findAll() {
    return this.portfolioGenreService.findAll();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGenreDto: { name: string },
  ) {
    await this.portfolioGenreService.update(id, updateGenreDto.name);
    return { message: 'Genre updated successfully' };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.portfolioGenreService.remove(id);
    return { message: 'Genre deleted successfully' };
  }
}
