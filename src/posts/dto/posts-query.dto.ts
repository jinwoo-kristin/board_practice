import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PostsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
