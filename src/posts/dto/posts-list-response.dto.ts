import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';
import { Post } from '../post.entity';

export class PostListResponseDto {
  @ApiProperty({ description: '게시글 목록', type: [PostResponseDto] })
  items: PostResponseDto[];

  @ApiProperty({ description: '전체 게시글 수' })
  total: number;

  private constructor(items: PostResponseDto[], total: number) {
    this.items = items;
    this.total = total;
  }

  static from(posts: Post[], total: number): PostListResponseDto {
    return new PostListResponseDto(posts.map(PostResponseDto.from), total);
  }
}
