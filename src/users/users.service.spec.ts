import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('유저를 생성하면 DTO 값과 일치하는 유저가 반환된다', async () => {
      // given
      const dto = Object.assign(new CreateUserDto(), {
        name: 'jinwoo',
        email: 'test@test.com',
        password: 'password123',
      });

      // when
      const result = await service.create(dto);

      // then
      expect(result.id).toBeDefined();
      expect(result.name).toBe(dto.name);
      expect(result.email).toBe(dto.email);
    });
  });
});
