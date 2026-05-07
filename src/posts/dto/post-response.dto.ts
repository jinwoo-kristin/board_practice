import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post.entity';

export class PostResponseDto {
  @ApiProperty({ description: '게시글 ID' })
  readonly id: number;

  @ApiProperty({ description: '제목' })
  readonly title: string;

  @ApiProperty({ description: '내용' })
  readonly content: string;

  @ApiProperty({ description: '작성자 ID' })
  readonly userId: number;

  @ApiProperty({ description: '생성일' })
  readonly created_at: Date;

  @ApiProperty({ description: '수정일' })
  readonly updated_at: Date;

  private constructor(
    id: number,
    title: string,
    content: string,
    userId: number,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static from(post: Post): PostResponseDto {
    return new PostResponseDto(
      post.id,
      post.title,
      post.content,
      post.user.id,
      post.created_at,
      post.updated_at,
    );
  }
}
