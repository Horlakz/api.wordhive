import {
  BadRequestException,
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
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogService } from '../services/blog.service';
import { PaginationResponseDto } from '@/common/dto/paginationResponse.dto';
import { Blog } from '../entities/blog.entity';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.blogService.remove(id);
    return { message: 'Blog deleted successfully' };
  }
}
