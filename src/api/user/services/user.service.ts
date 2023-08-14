import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { UserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(query?: { isAdmin: boolean }): Promise<User[]> {
    return this.usersRepository.find({
      select: [
        'uuid',
        'fullname',
        'email',
        'isAdmin',
        'isEmailVerified',
        'created_at',
      ],
      where: { isAdmin: query?.isAdmin },
    });
  }

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByUUID(uuid: UUID): Promise<User> {
    const user = await this.usersRepository.findOneBy({ uuid });
    return user;
  }

  create(userDto: UserDto): Promise<User> {
    const user = new User();
    user.fullname = userDto.fullname;
    user.email = userDto.email;
    user.password = userDto.password;
    user.isAdmin = userDto.isAdmin;

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
