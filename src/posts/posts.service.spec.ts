import { setupTestModule } from '../test-utils/setup-test-module';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostMapper } from './post.mapper';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UserMapper } from '../users/user.mapper';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { BoardException } from '../common/exceptions/board.exception';
import { ErrorCode } from '../common/exceptions/error-code';

describe('PostsService', () => {
  const getModule = setupTestModule([User, Post], [PostsService, PostsRepository, PostMapper, UsersService, UsersRepository, UserMapper]);
  let postsService: PostsService;
  let usersService: UsersService;

  beforeAll(() => {
    postsService = getModule().get<PostsService>(PostsService);
    usersService = getModule().get<UsersService>(UsersService);
  });

  async function createUser() {
    return usersService.create(
      Object.assign(new CreateUserDto(), {
        name: 'jinwoo',
        email: 'test@test.com',
        password: 'password123',
      }),
    );
  }

  async function createPost(userId: number) {
    return postsService.create(
      Object.assign(new CreatePostDto(), {
        title: '제목',
        content: '내용',
        userId,
      }),
    );
  }

  describe('create', () => {
    it('게시글을 생성한다.', async () => {
      // given
      const user = await createUser();

      // when
      const result = await createPost(user.id);

      // then
      expect(result.id).toBeDefined();
      expect(result.title).toBe('제목');
      expect(result.content).toBe('내용');
      expect(result.userId).toBe(user.id);
    });

    it('존재하지 않는 userId로 생성하면 BoardException(USER_NOT_FOUND)이 발생한다.', async () => {
      // given
      const invalidDto = Object.assign(new CreatePostDto(), {
        title: '제목',
        content: '내용',
        userId: -1,
      });

      // when & then
      await expect(postsService.create(invalidDto)).rejects.toThrow(BoardException);
      await expect(postsService.create(invalidDto)).rejects.toMatchObject({
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    });
  });

  describe('update', () => {
    it('게시글을 수정한다.', async () => {
      // given
      const user = await createUser();
      const post = await createPost(user.id);
      const updateDto = Object.assign(new UpdatePostDto(), {
        title: '수정된 제목',
        content: '수정된 내용',
        userId: user.id,
      });

      // when
      const result = await postsService.update(post.id, updateDto);

      // then
      expect(result.id).toBe(post.id);
      expect(result.title).toBe(updateDto.title);
      expect(result.content).toBe(updateDto.content);
      expect(result.userId).toBe(user.id);
    });

    it('존재하지 않는 게시글이면 BoardException(POST_NOT_FOUND)이 발생한다.', async () => {
      // given
      const updateDto = Object.assign(new UpdatePostDto(), {
        title: '제목',
        content: '내용',
        userId: 1,
      });

      // when & then
      await expect(postsService.update(-1, updateDto)).rejects.toThrow(BoardException);
      await expect(postsService.update(-1, updateDto)).rejects.toMatchObject({
        errorCode: ErrorCode.POST_NOT_FOUND,
      });
    });

    it('작성자가 아닌 유저가 수정하면 BoardException(POST_FORBIDDEN)이 발생한다.', async () => {
      // given
      const user = await createUser();
      const post = await createPost(user.id);
      const updateDto = Object.assign(new UpdatePostDto(), {
        title: '수정된 제목',
        content: '수정된 내용',
        userId: -1,
      });

      // when & then
      await expect(postsService.update(post.id, updateDto)).rejects.toThrow(BoardException);
      await expect(postsService.update(post.id, updateDto)).rejects.toMatchObject({
        errorCode: ErrorCode.POST_FORBIDDEN,
      });
    });
  });

  describe('delete', () => {
    it('게시글을 삭제한다.', async () => {
      // given
      const user = await createUser();
      const post = await createPost(user.id);

      // when & then
      await expect(postsService.delete(post.id, user.id)).resolves.toBeUndefined();
    });

    it('존재하지 않는 게시글이면 BoardException(POST_NOT_FOUND)이 발생한다.', async () => {
      await expect(postsService.delete(-1, 1)).rejects.toThrow(BoardException);
      await expect(postsService.delete(-1, 1)).rejects.toMatchObject({
        errorCode: ErrorCode.POST_NOT_FOUND,
      });
    });

    it('작성자가 아닌 유저가 삭제하면 BoardException(POST_FORBIDDEN)이 발생한다.', async () => {
      // given
      const user = await createUser();
      const post = await createPost(user.id);

      // when & then
      await expect(postsService.delete(post.id, user.id + 999)).rejects.toThrow(BoardException);
      await expect(postsService.delete(post.id, user.id + 999)).rejects.toMatchObject({
        errorCode: ErrorCode.POST_FORBIDDEN,
      });
    });
  });

  describe('findAll', () => {
    it('게시글 목록과 전체 개수를 반환한다', async () => {
      // given
      const user = await createUser();
      for (let i = 0; i < 3; i++) {
        await createPost(user.id);
      }
      const query = Object.assign(new PostsQueryDto(), { page: 1, limit: 2 });

      // when
      const result = await postsService.findAll(query);

      // then
      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(2);
    });

    it('게시글이 없으면 빈 배열과 total 0을 반환한다', async () => {
      // given
      const query = Object.assign(new PostsQueryDto(), { page: 1, limit: 10 });

      // when
      const result = await postsService.findAll(query);

      // then
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });
  });
});
