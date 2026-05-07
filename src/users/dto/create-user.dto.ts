import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  toEntity(): User {
    return new User({
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }
}
