import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post.entity';

export class PostResponseDto {
  @ApiProperty({ description: '게시글 ID' })
  id: number;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '작성자 ID' })
  userId: number;

  @ApiProperty({ description: '생성일' })
  created_at: Date;

  @ApiProperty({ description: '수정일' })
  updated_at: Date;

  static from(post: Post): PostResponseDto {
    return Object.assign(new PostResponseDto(), {
      id: post.id,
      title: post.title,
      content: post.content,
      userId: post.user.id,
      created_at: post.created_at,
      updated_at: post.updated_at,
    });
  }
}
