import { NotFoundException } from '@nestjs/common';
import { setupTestModule } from '../test-utils/setup-test-module';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
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
});
