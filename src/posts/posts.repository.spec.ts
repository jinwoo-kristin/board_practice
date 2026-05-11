import { setupTestModule } from '../test-utils/setup-test-module';
import { PostsRepository } from './posts.repository';
import { Post } from './post.entity';
import { UsersRepository } from '../users/users.repository';
import { User } from '../users/user.entity';

describe('PostsRepository', () => {
  const getModule = setupTestModule([User, Post], [UsersRepository, PostsRepository]);
  let repository: PostsRepository;
  let usersRepository: UsersRepository;

  beforeAll(() => {
    repository = getModule().get<PostsRepository>(PostsRepository);
    usersRepository = getModule().get<UsersRepository>(UsersRepository);
  });

  async function createUser(): Promise<User> {
    return usersRepository.save(
      new User({ name: 'jinwoo', email: 'test@test.com', password: 'pw' }),
    );
  }

  async function createPost(user: User): Promise<Post> {
    return repository.save(new Post({ title: '제목', content: '내용', user }));
  }

  describe('save', () => {
    it('Post를 저장하면 id가 부여된 Post가 반환된다', async () => {
      // given
      const user = await createUser();
      const post = new Post({ title: '제목', content: '내용', user });

      // when
      const result = await repository.save(post);

      // then
      expect(result.id).toBeDefined();
      expect(result.title).toBe(post.title);
      expect(result.content).toBe(post.content);
    });
  });

  describe('findAll', () => {
    it('게시글 목록과 total을 반환한다', async () => {
      // given
      const user = await createUser();
      await createPost(user);
      await createPost(user);

      // when
      const [posts, total] = await repository.findAll(1, 10);

      // then
      expect(total).toBe(2);
      expect(posts).toHaveLength(2);
    });

    it('게시글이 없으면 빈 배열과 total 0을 반환한다', async () => {
      // when
      const [posts, total] = await repository.findAll(1, 10);

      // then
      expect(total).toBe(0);
      expect(posts).toHaveLength(0);
    });

    it('limit보다 많은 게시글이 있으면 limit 수만큼만 반환된다', async () => {
      // given
      const user = await createUser();
      for (let i = 0; i < 3; i++) {
        await createPost(user);
      }

      // when
      const [posts, total] = await repository.findAll(1, 2);

      // then
      expect(total).toBe(3);
      expect(posts).toHaveLength(2);
    });
  });

  describe('findPostById', () => {
    it('존재하는 id로 조회하면 user 관계를 포함한 Post가 반환된다', async () => {
      // given
      const user = await createUser();
      const saved = await createPost(user);

      // when
      const result = await repository.findPostById(saved.id);

      // then
      expect(result).not.toBeNull();
      expect(result!.id).toBe(saved.id);
      expect(result!.user.id).toBe(user.id);
    });

    it('존재하지 않는 id로 조회하면 null이 반환된다', async () => {
      // when
      const result = await repository.findPostById(-1);

      // then
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('삭제 후 findPostById로 조회하면 null이 반환된다', async () => {
      // given
      const user = await createUser();
      const saved = await createPost(user);

      // when
      await repository.delete(saved.id);

      // then
      const result = await repository.findPostById(saved.id);
      expect(result).toBeNull();
    });
  });
});
