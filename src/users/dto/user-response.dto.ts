import { User } from '../user.entity';

export class UserResponseDto {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}

  static from(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.name,
      user.email,
      user.created_at,
      user.updated_at,
    );
  }
}
