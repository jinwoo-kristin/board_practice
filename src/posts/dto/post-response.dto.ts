import { Post } from '../post.entity';

export class PostResponseDto {
  private constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly content: string,
    public readonly userId: number,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}

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
