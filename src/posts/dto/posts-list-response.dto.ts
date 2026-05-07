import { PostResponseDto } from './post-response.dto';

export class PostListResponseDto {
  constructor(
    public readonly items: PostResponseDto[],
    public readonly total: number,
  ) {}
}
