import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaModule } from '../media/media.module';
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
  imports: [
    TypeOrmModule.forFeature([Showcase, ShowcaseField, ShowcaseGenre]),
    MediaModule,
  ],
  controllers: [
    ShowcaseController,
    ShowcaseFieldController,
    ShowcaseGenreController,
  ],
  providers: [ShowcaseService, ShowcaseFieldService, ShowcaseGenreService],
})
export class ShowcaseModule {}
