import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름' })
  name!: string;

  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호' })
  password!: string;
}
