import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Transactional } from 'typeorm-transactional';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { BoardException } from '../common/exceptions/board.exception';
import { USER_NOT_FOUND } from '../common/exceptions/error-definitions';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userMapper: UserMapper,
  ) {}

  @Transactional()
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userMapper.toEntity(dto, hashedPassword);
    const saved = await this.usersRepository.save(user);
    return this.userMapper.toResponse(saved);
  }

  async findUser(id: number): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    return this.userMapper.toResponse(user);
  }

  private async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findUserById(id);
    if (!user) throw new BoardException(USER_NOT_FOUND);
    return user;
  }
}
