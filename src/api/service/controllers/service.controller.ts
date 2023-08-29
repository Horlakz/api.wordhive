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
  Query,
  UsePipes,
} from '@nestjs/common';

import { Public } from '@/common/decorators/auth.public.decorator';
import { CreateServiceDto } from '../dto/create-service.dto';
import { ServiceService } from '../services/service.service';
import { SkipValidation } from '@/common/decorators/skip-validation.decorator';
import { ServiceValidationPipe } from '@/validation/service-validation.pipe';
import { PaginationResponseDto } from '@/common/dto/paginationResponse.dto';

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
  async findAll(
    @Query('category') category: string,
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { services, count } = await this.serviceService.findAll(
      name,
      category,
      {
        page,
        limit,
      },
    );

    const response: PaginationResponseDto<(typeof services)[0]> = {
      results: services,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    };

    return response;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.serviceService.remove(id);
  }
}
