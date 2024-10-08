import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    try {
      const faq = new Faq();
      faq.question = createFaqDto.question;
      faq.answer = createFaqDto.answer;
      return await this.faqRepository.save(faq);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(searchTerm: string) {
    const queryBuilder = this.faqRepository.createQueryBuilder('faq');
    if (searchTerm) {
      queryBuilder.where(
        'faq.question LIKE :searchTerm OR faq.answer LIKE :searchTerm',
        {
          searchTerm: `%${searchTerm}%`,
        },
      );
    }
    return await queryBuilder.getMany();
  }

  async update(uuid: string, updateFaqDto: UpdateFaqDto) {
    const faq = this.faqRepository.create(updateFaqDto);
    await this.faqRepository.update({ uuid }, faq);
    return await this.faqRepository.findOne({ where: { uuid } });
  }

  async remove(uuid: string) {
    await this.faqRepository.softRemove({ uuid });

    return {
      message: 'Faq deleted successfully',
    };
  }
}
