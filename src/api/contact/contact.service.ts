import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const contact = await this.contactRepository.create(createContactDto);
      return await this.contactRepository.save(contact);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(email: string): Promise<Contact> {
    try {
      return await this.contactRepository.findOneBy({ email });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(paginationDto?: PaginationDto): Promise<Contact[]> {
    let contacts: Contact[];

    if (paginationDto) {
      const { page, limit } = paginationDto;
      const skip = (page - 1) * limit;

      contacts = await this.contactRepository.find({ skip, take: limit });
    }

    contacts = await this.contactRepository.find();

    return contacts;
  }

  async remove(uuid: string) {
    return await this.contactRepository.softDelete({ uuid });
  }

  async countAll(): Promise<number> {
    return await this.contactRepository.count();
  }
}
