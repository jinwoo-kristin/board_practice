import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }
}
