import { Public } from '@/common/decorators/auth.public.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { BlogCommentService as CommentService } from '../services/comment.service';

@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post(':blog_id')
  async create(
    @Param('blog_id', ParseUUIDPipe) blogId: string,
    @Body()
    createCommentDto: CreateCommentDto,
  ) {
    if (!createCommentDto.fullname || !createCommentDto.message)
      throw new BadRequestException('Comment Fields are required');

    await this.commentService.create(createCommentDto, blogId);

    return { message: 'Comment created successfully' };
  }

  @Public()
  @Get(':blog_id')
  async findAllBlogComments(@Param('blog_id', ParseUUIDPipe) blogId: string) {
    return this.commentService.findAllByBlog(blogId);
  }
}
