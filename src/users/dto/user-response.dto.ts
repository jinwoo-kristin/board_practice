import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserResponseDto {
  @ApiProperty({ description: '유저 ID' })
  id: number;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '생성일' })
  created_at: Date;

  @ApiProperty({ description: '수정일' })
  updated_at: Date;

  static from(user: User): UserResponseDto {
    return Object.assign(new UserResponseDto(), {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
}
