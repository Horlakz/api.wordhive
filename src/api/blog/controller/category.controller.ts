import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BlogCategoryService as CategoryService } from '../services/category.service';

@Controller('blog-category')
export class BlogCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createCategoryDto: { name: string }) {
    if (!createCategoryDto.name)
      throw new BadRequestException('Category Name is required');
    await this.categoryService.create(createCategoryDto.name);

    return { message: 'Category created successfully' };
  }

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
