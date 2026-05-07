import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/user.entity';
import { Post } from '../post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  userId: number; // todo userId 사용하지 않는 방향 고민

  toEntity(user: User): Post {
    return new Post({ title: this.title, content: this.content, user });
  }
}
