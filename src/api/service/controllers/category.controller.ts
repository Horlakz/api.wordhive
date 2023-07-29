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
import { CategoryService } from '../services/category.service';

@Controller('service-category')
export class ServiceCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createCategoryDto: { name: string }) {
    if (!createCategoryDto.name)
      throw new BadRequestException('Name is required');

    await this.categoryService.create(createCategoryDto.name);

    return { message: 'Category created successfully' };
  }

  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: { name: string },
  ) {
    await this.categoryService.update(id, updateCategoryDto.name);
    return { message: 'Category updated successfully' };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoryService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
