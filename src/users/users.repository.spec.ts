import { setupTestModule } from '../test-utils/setup-test-module';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

describe('UsersRepository', () => {
  const getModule = setupTestModule([User], [UsersRepository]);
  let repository: UsersRepository;
  const user = new User({
    name: 'jinwoo',
    email: 'test@test.com',
    password: 'pw',
  });

  beforeAll(() => {
    repository = getModule().get<UsersRepository>(UsersRepository);
  });

  describe('save', () => {
    it('User를 저장하면 id가 부여된 User가 반환된다', async () => {
      // given & when
      const result = await repository.save(user);

      // then
      expect(result.id).toBeDefined();
      expect(result.name).toBe(user.name);
      expect(result.email).toBe(user.email);
    });
  });

  describe('findUserById', () => {
    it('존재하는 id로 조회하면 User가 반환된다', async () => {
      // given
      const saved = await repository.save(user);

      // when
      const result = await repository.findUserById(saved.id);

      // then
      expect(result).not.toBeNull();
      expect(result!.id).toBe(saved.id);
      expect(result!.name).toBe(saved.name);
      expect(result!.email).toBe(saved.email);
    });

    it('존재하지 않는 id로 조회하면 null이 반환된다', async () => {
      // when
      const result = await repository.findUserById(-1);

      // then
      expect(result).toBeNull();
    });
  });
});
