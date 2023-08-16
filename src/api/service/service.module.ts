import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaModule } from '../media/media.module';
import { ServiceCategoryController } from './controllers/category.controller';
import { IconController } from './controllers/icon.controller';
import { ServiceController } from './controllers/service.controller';
import { ServiceCategory } from './entities/category.entity';
import { ServiceIcon } from './entities/icon.entity';
import { Service } from './entities/service.entity';
import { CategoryService } from './services/category.service';
import { IconService } from './services/icon.service';
import { ServiceService } from './services/service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceCategory, ServiceIcon, Service]),
    MediaModule,
  ],
  controllers: [ServiceController, ServiceCategoryController, IconController],
  providers: [ServiceService, CategoryService, IconService],
  exports: [ServiceService],
})
export class ServiceModule {}
