import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostListResponseDto } from './dto/posts-list-response.dto';

@Injectable()
export class PostMapper {
  toEntity(dto: CreatePostDto, user: User): Post {
    return new Post({ title: dto.title, content: dto.content, user });
  }

  toResponse(post: Post): PostResponseDto {
    return new PostResponseDto(
      post.id,
      post.title,
      post.content,
      post.user.id,
      post.created_at,
      post.updated_at,
    );
  }

  toListResponse(posts: Post[], total: number): PostListResponseDto {
    return new PostListResponseDto(
      posts.map((p) => this.toResponse(p)),
      total,
    );
  }
}
