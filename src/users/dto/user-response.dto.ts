import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserResponseDto {
  @ApiProperty({ description: '유저 ID' })
  readonly id: number;

  @ApiProperty({ description: '이름' })
  readonly name: string;

  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @ApiProperty({ description: '생성일' })
  readonly created_at: Date;

  @ApiProperty({ description: '수정일' })
  readonly updated_at: Date;

  private constructor(
    id: number,
    name: string,
    email: string,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static from(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.name,
      user.email,
      user.created_at,
      user.updated_at,
    );
  }
}
