import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { IconService } from '../services/icon.service';
import { CreateIconDto } from '../dto/create-icon.dto';

@Controller('service-icon')
export class IconController {
  constructor(private readonly iconService: IconService) {}

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
          maxSize: 1000000,
          message(maxSize) {
            return 'File is too large. Max size is ' + maxSize / 1000000 + 'MB';
          },
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() createIconDto: CreateIconDto,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required!');
    }

    createIconDto.file = file;
    return this.iconService.create(createIconDto);
  }

  @Get()
  findAll() {
    return this.iconService.findAll();
  }
}
