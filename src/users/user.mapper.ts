import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserMapper {
  toEntity(dto: CreateUserDto, hashedPassword: string): User {
    return new User({ name: dto.name, email: dto.email, password: hashedPassword });
  }

  toResponse(user: User): UserResponseDto {
    return new UserResponseDto(user.id, user.name, user.email, user.created_at, user.updated_at);
  }
}
