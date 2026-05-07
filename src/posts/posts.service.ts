import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsQueryDto } from './dto/posts-query.dto';
import { PostListResponseDto } from './dto/posts-list-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Transactional()
  async create(dto: CreatePostDto): Promise<PostResponseDto> {
    const user = await this.findUser(dto.userId);

    const post = dto.toEntity(user);
    const saved = await this.postsRepository.save(post);
    return PostResponseDto.from(saved);
  }

  private async findUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    return user;
  }

  async findAll(query: PostsQueryDto): Promise<PostListResponseDto> {
    const { page, limit } = query;
    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return PostListResponseDto.from(posts, total);
  }

  @Transactional()
  async update(id: number, dto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.findPost(id);
    this.validateUserPost(dto.userId, post);

    post.update(dto.title, dto.content);
    const saved = await this.postsRepository.save(post);
    return PostResponseDto.from(saved);
  }

   private async findPost(id:number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    return post;
  }

  private validateUserPost(userId: number, post: Post) {
    if (post.user.id !== userId) {
      throw new ForbiddenException('게시글에 접근할 권한이 없습니다.');
    }
  }

  @Transactional()
  async delete(id: number, userId: number): Promise<void> {
    const post = await this.findPost(id);
    this.validateUserPost(userId, post);
    await this.postsRepository.delete(id);
  }
}
