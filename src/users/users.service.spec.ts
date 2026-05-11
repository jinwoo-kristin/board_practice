import { setupTestModule } from '../test-utils/setup-test-module';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BoardException } from '../common/exceptions/board.exception';
import { ErrorCode } from '../common/exceptions/error-code';

describe('UsersService', () => {
  const getModule = setupTestModule([User], [UsersService, UsersRepository]);
  let service: UsersService;

  beforeAll(() => {
    service = getModule().get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('유저를 생성한다.', async () => {
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

  describe('findUser', () => {
    it('존재하는 id로 조회하면 UserResponseDto가 반환된다', async () => {
      // given
      const dto = Object.assign(new CreateUserDto(), {
        name: 'jinwoo',
        email: 'test@test.com',
        password: 'password123',
      });
      const created = await service.create(dto);

      // when
      const result = await service.findUser(created.id);

      // then
      expect(result.id).toBe(created.id);
      expect(result.name).toBe(dto.name);
      expect(result.email).toBe(dto.email);
    });

    it('존재하지 않는 id로 조회하면 BoardException(USER_NOT_FOUND)이 발생한다', async () => {
      // when & then
      await expect(service.findUser(-1)).rejects.toThrow(BoardException);
      await expect(service.findUser(-1)).rejects.toMatchObject({
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    });
  });
});
