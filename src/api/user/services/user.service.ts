import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByUUID(uuid: UUID): Promise<User> {
    const user = await this.usersRepository.findOneBy({ uuid });
    return user;
  }

  create(fullname: string, email: string, password: string): Promise<User> {
    const user = new User();
    user.fullname = fullname;
    user.email = email;
    user.password = password;

    return this.usersRepository.save(user);
  }

  async verifyEmail(email: string): Promise<void> {
    const user = await this.findOne(email);
    user.isEmailVerified = true;
    await this.usersRepository.save(user);
  }

  async updatePassword(email: string, password: string): Promise<void> {
    const user = await this.findOne(email);
    user.password = password;
    await this.usersRepository.save(user);
  }
}