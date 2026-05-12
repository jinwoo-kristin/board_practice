import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto {
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
  userId!: number;
}
