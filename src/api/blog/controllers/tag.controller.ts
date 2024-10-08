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
import { BlogTagService as TagService } from '../services/tag.service';

@Controller('blog-tag')
export class BlogTagController {
  constructor(private readonly tagService: TagService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createTagDto: { name: string }) {
    if (!createTagDto.name)
      throw new BadRequestException('Tag Name is required');
    await this.tagService.create(createTagDto.name);

    return { message: 'Tag created successfully' };
  }

  @Public()
  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTagDto: { name: string },
  ) {
    await this.tagService.update(id, updateTagDto.name);
    return { message: 'Tag updated successfully' };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tagService.remove(id);
    return { message: 'Tag deleted successfully' };
  }
}
