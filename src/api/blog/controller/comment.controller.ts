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
import { BlogCommentService as CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(':blog_id')
  async create(
    @Param(':blog_id', ParseUUIDPipe) blogId: string,
    @Body()
    createCommentDto: CreateCommentDto,
  ) {
    if (!createCommentDto.fullname || !createCommentDto.message)
      throw new BadRequestException('Comment Fields are required');

    await this.commentService.create(createCommentDto, blogId);

    return { message: 'Comment created successfully' };
  }

  @Get(':blog_id')
  async findAllBlogComments(@Param(':blog_id', ParseUUIDPipe) blogId: string) {
    return this.commentService.findAllByBlog(blogId);
  }
}
