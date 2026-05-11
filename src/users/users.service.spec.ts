import { setupTestModule } from '../test-utils/setup-test-module';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UserMapper } from './user.mapper';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BoardException } from '../common/exceptions/board.exception';
import { ErrorCode } from '../common/exceptions/error-code';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersService', () => {
  const getModule = setupTestModule([User], [UsersService, UsersRepository, UserMapper]);
  let service: UsersService;

  beforeAll(() => {
    service = getModule().get<UsersService>(UsersService);
  });

  async function createUser(): Promise<UserResponseDto> {
    return service.create(
      Object.assign(new CreateUserDto(), {
        name: 'jinwoo',
        email: 'test@test.com',
        password: 'password123',
      })
    );
  }

  describe('create', () => {
    it('유저를 생성한다.', async () => {
      // given
      const dto =  Object.assign(new CreateUserDto(), {
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
      const user = await createUser();

      // when
      const result = await service.findUser(user.id);

      // then
      expect(result.id).toBe(user.id);
      expect(result.name).toBe(user.name);
      expect(result.email).toBe(user.email);
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
