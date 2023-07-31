import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PortfolioFieldService } from '../services/field.service';
import { Public } from '@/common/decorators/auth.public.decorator';

@Controller('portfolio-field')
export class PortfolioFieldController {
  constructor(private readonly portfolioFieldService: PortfolioFieldService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createFieldDto: { name: string }) {
    if (!createFieldDto.name)
      throw new BadRequestException('Field Name is required');
    await this.portfolioFieldService.create(createFieldDto.name);

    return { message: 'Field created successfully' };
  }

  @Public()
  @Get()
  findAll() {
    return this.portfolioFieldService.findAll();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: { name: string },
  ) {
    await this.portfolioFieldService.update(id, updateCategoryDto.name);
    return { message: 'Field updated successfully' };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.portfolioFieldService.remove(id);
    return { message: 'Field deleted successfully' };
  }
}
