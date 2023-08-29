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

  findAll(query?: { isAdmin: boolean; name: string }): Promise<User[]> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.uuid',
        'user.fullname',
        'user.email',
        'user.isAdmin',
        'user.isEmailVerified',
        'user.created_at',
      ])
      .where('user.isAdmin = :isAdmin', { isAdmin: query?.isAdmin });

    if (query?.name) {
      queryBuilder.andWhere('user.fullname LIKE :name', {
        name: `%${query.name}%`,
      });
    }

    return queryBuilder.getMany();
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

  async remove(user: User): Promise<void> {
    await this.usersRepository.softRemove(user);
  }
}
