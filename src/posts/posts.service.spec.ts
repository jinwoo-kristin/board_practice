import { NotFoundException } from '@nestjs/common';
import { setupTestModule } from '../test-utils/setup-test-module';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('PostsService', () => {
  const getModule = setupTestModule([User, Post], [PostsService, UsersService]);
  let postsService: PostsService;
  let usersService: UsersService;

  beforeAll(() => {
    postsService = getModule().get<PostsService>(PostsService);
    usersService = getModule().get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('게시글을 생성한다.', async () => {
      // given
      const userDto = Object.assign(new CreateUserDto(), {
        name: 'jinwoo',
        email: 'test@test.com',
        password: 'password123',
      });
      const createdUser = await usersService.create(userDto);

      const postDto = Object.assign(new CreatePostDto(), {
        title: '제목',
        content: '내용',
        userId: createdUser.id,
      });

      // when
      const result = await postsService.create(postDto);

      // then
      expect(result.id).toBeDefined();
      expect(result.title).toBe(postDto.title);
      expect(result.content).toBe(postDto.content);
      expect(result.userId).toBe(createdUser.id);
    });

    it('존재하지 않는 userId로 생성하면 NotFoundException이 발생한다.', async () => {
      // given
      const postDto = Object.assign(new CreatePostDto(), {
        title: '제목',
        content: '내용',
        userId: -1,
      });

      // when & then
      await expect(postsService.create(postDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('게시글 목록과 전체 개수를 반환한다', async () => {
      // given
      const userDto = Object.assign(new CreateUserDto(), {
        name: 'jinwoo',
        email: 'test@test.com',
        password: 'password123',
      });
      const createdUser = await usersService.create(userDto);

      for (let i = 1; i <= 3; i++) {
        await postsService.create(
          Object.assign(new CreatePostDto(), {
            title: `제목${i}`,
            content: `내용${i}`,
            userId: createdUser.id,
          }),
        );
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
