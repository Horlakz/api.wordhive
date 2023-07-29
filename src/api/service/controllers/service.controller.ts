import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
} from '@nestjs/common';

import { Public } from '@/common/decorators/auth.public.decorator';
import { CreateServiceDto } from '../dto/create-service.dto';
import { ServiceService } from '../services/service.service';
import { SkipValidation } from '@/common/decorators/skip-validation.decorator';
import { ServiceValidationPipe } from '@/validation/service-validation.pipe';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @SkipValidation()
  @UsePipes(new ServiceValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    await this.serviceService.create(createServiceDto);

    return { message: 'Service has been Created Successfully' };
  }

  @Public()
  @Get()
  async findAll() {
    return await this.serviceService.findAll();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.serviceService.remove(id);
  }
}
