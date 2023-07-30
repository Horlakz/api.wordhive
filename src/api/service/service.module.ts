import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceService } from './services/service.service';
import { ServiceController } from './controllers/service.controller';
import { CategoryService } from './services/category.service';
import { ServiceCategoryController } from './controllers/category.controller';
import { ServiceCategory } from './entities/category.entity';
import { Service } from './entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory, Service])],
  controllers: [ServiceController, ServiceCategoryController],
  providers: [ServiceService, CategoryService],
  exports: [ServiceService],
})
export class ServiceModule {}
