import { Public } from '@/common/decorators/auth.public.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { BlogCommentService as CommentService } from '../services/comment.service';

@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post(':slug')
  async create(
    @Param('slug') blogSlug: string,
    @Body()
    createCommentDto: CreateCommentDto,
  ) {
    await this.commentService.create(createCommentDto, blogSlug);

    return { message: 'Comment created successfully' };
  }

  @Public()
  @Get(':slug')
  async findAllBlogComments(@Param('slug') blogSlug: string) {
    return this.commentService.findAllByBlog(blogSlug);
  }
}
