import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsS3Service } from '@/config/aws/aws_s3.service';
import { ShowcaseFieldController } from './controllers/field.controller';
import { ShowcaseGenreController } from './controllers/genre.controller';
import { ShowcaseController } from './controllers/showcase.controller';
import { ShowcaseField } from './entities/field.entity';
import { ShowcaseGenre } from './entities/genre.entity';
import { Showcase } from './entities/showcase.entity';
import { ShowcaseFieldService } from './services/field.service';
import { ShowcaseGenreService } from './services/genre.service';
import { ShowcaseService } from './services/showcase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Showcase, ShowcaseField, ShowcaseGenre])],
  controllers: [
    ShowcaseController,
    ShowcaseFieldController,
    ShowcaseGenreController,
  ],
  providers: [
    ShowcaseService,
    ShowcaseFieldService,
    ShowcaseGenreService,
    AwsS3Service,
  ],
})
export class ShowcaseModule {}
