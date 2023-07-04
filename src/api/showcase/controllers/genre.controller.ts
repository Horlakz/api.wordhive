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
import { ShowcaseGenreService as ShowcaseGenreService } from '../services/genre.service';

@Controller('showcase-genre')
export class ShowcaseGenreController {
  constructor(private readonly showcaseGenreService: ShowcaseGenreService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createGenreDto: { name: string }) {
    if (!createGenreDto.name)
      throw new BadRequestException('Genre Name is required');
    await this.showcaseGenreService.create(createGenreDto.name);

    return { message: 'Genre created successfully' };
  }

  @Public()
  @Get()
  findAll() {
    return this.showcaseGenreService.findAll();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGenreDto: { name: string },
  ) {
    await this.showcaseGenreService.update(id, updateGenreDto.name);
    return { message: 'Genre updated successfully' };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.showcaseGenreService.remove(id);
    return { message: 'Genre deleted successfully' };
  }
}
