import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PostsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '페이지 번호', default: 1 })
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '페이지당 항목 수', default: 10 })
  limit: number = 10;
}
