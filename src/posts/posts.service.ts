import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
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
    const user = await this.usersRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    const post = dto.toEntity(user);
    const saved = await this.postsRepository.save(post);
    return PostResponseDto.from(saved);
  }

  async findAll(query: PostsQueryDto): Promise<PostListResponseDto> {
    const { page, limit } = query;
    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return new PostListResponseDto(posts.map(PostResponseDto.from), total);
  }
}
