import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Public } from '@/common/decorators/auth.public.decorator';
import { EmailService } from '@/shared/services/email.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';
import { MailOptions } from '@/common/interfaces/mail-options';

@Controller('faq')
export class FaqController {
  constructor(
    private readonly faqService: FaqService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.faqService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
