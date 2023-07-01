import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(
    fullname: string,
    email: string,
    password: string,
    is_admin: boolean = false,
  ): Promise<User> {
    const user = new User();
    user.fullname = fullname;
    user.email = email;
    user.password = password;
    user.isAdmin = is_admin;

    return this.usersRepository.save(user);
  }
}
