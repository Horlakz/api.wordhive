import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Public } from '@/common/decorators/auth.public.decorator';
import { PaginationResponseDto } from '@/common/dto/paginationResponse.dto';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { Blog } from '../entities/blog.entity';
import { BlogService } from '../services/blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Public()
  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('tag', new ParseArrayPipe({ items: String, optional: true }))
    tag?: string[],
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const [blogs, total] = await this.blogService.findAll(
      search,
      category,
      tag,
      {
        page,
        limit,
      },
    );

    const response: PaginationResponseDto<Blog> = {
      results: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return response;
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOneBySlug(slug);
  }

  @Patch(':slug')
  async update(
    @Body() updateBlogDto: UpdateBlogDto,
    @Param('slug') slug: string,
  ) {
    await this.blogService.update(slug, updateBlogDto);
    return { message: 'Blog updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.blogService.remove(id);
    return { message: 'Blog deleted successfully' };
  }
}
