import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import { Public } from '@/common/decorators/auth.public.decorator';
import { PaginationResponseDto } from '@/common/dto/paginationResponse.dto';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const exists = await this.contactService.findOne(createContactDto.email);
    if (exists) throw new ConflictException('Contact already sent a message');
    return await this.contactService.create(createContactDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const results = await this.contactService.findAll({ page, limit });
    const total = await this.contactService.countAll();

    const response: PaginationResponseDto<(typeof results)[0]> = {
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return response;
  }
}
