import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaModule } from '../media/media.module';
import { PortfolioFieldController } from './controllers/field.controller';
import { PortfolioGenreController } from './controllers/genre.controller';
import { PorfolioController } from './controllers/portfolio.controller';
import { PortfolioField } from './entities/field.entity';
import { PortfolioGenre } from './entities/genre.entity';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioFieldService } from './services/field.service';
import { PortfolioGenreService } from './services/genre.service';
import { PortfolioService } from './services/portfolio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio, PortfolioField, PortfolioGenre]),
    MediaModule,
  ],
  controllers: [
    PorfolioController,
    PortfolioFieldController,
    PortfolioGenreController,
  ],
  providers: [PortfolioService, PortfolioFieldService, PortfolioGenreService],
})
export class PortfolioModule {}
