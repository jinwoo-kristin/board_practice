import { User } from '../user.entity';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;

  toEntity(): User {
    return new User({
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }
}
