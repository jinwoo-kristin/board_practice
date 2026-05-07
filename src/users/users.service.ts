import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Transactional } from 'typeorm-transactional';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { BoardException } from '../common/exceptions/board.exception';
import { ErrorCode } from '../common/exceptions/error-code';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Transactional()
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = dto.toEntity(hashedPassword);
    const saved = await this.usersRepository.save(user);
    return UserResponseDto.from(saved);
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.findUser(id);
    return UserResponseDto.from(user);
  }

  private async findUser(id:number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new BoardException(ErrorCode.USER_NOT_FOUND);
    return user;
  }
}
