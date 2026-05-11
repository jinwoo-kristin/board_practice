import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/user.entity';
import { Post } from '../post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '제목' })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  content!: string;

  @IsInt()
  @ApiProperty({ description: '작성자 ID' })
  userId!: number; // todo 추후 token 사용

  toEntity(user: User): Post {
    return new Post({ title: this.title, content: this.content, user });
  }
}
