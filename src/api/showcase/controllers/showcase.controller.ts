import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { Public } from '@/common/decorators/auth.public.decorator';
import { PaginationResponseDto } from '@/common/dto/paginationResponse.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateShowcaseDto } from '../dto/create-showcase.dto';
import { UpdateShowcaseDto } from '../dto/update-showcase.dto';
import { ShowcaseService } from '../services/showcase.service';

@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new UnsupportedMediaTypeException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 2000000,
          message(maxSize) {
            return 'File is too large. Max size is ' + maxSize / 1000000 + 'MB';
          },
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() createShowcaseDto: CreateShowcaseDto,
  ) {
    console.log(file);
    const { title, body, field, genre } = createShowcaseDto;
    if (!title || !body || !field || !genre)
      throw new BadRequestException('All Fields are required');

    createShowcaseDto.image = file;
    return this.showcaseService.create(createShowcaseDto);
  }

  @Public()
  @Get()
  async findAll(
    @Query('field') field?: string,
    @Query('genre', new ParseArrayPipe({ items: String, optional: true }))
    genre?: string[],
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const results = await this.showcaseService.findAll(field, genre, {
      limit,
      page,
    });
    const total = await this.showcaseService.countAll(field, genre, {
      limit,
      page,
    });
    const response: PaginationResponseDto<(typeof results)[0]> = {
      results,
      pagination: {
        page: +page,
        limit: +limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return response;
  }

  // @Public()
  // @Get(':slug')
  // findOne(@Param('slug') slug: string) {
  //   return this.blogService.findOneBySlug(slug);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateShowcaseDto) {
    return this.showcaseService.update(id, updateBlogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.showcaseService.remove(id);
    return { message: 'Blog deleted successfully' };
  }
}
