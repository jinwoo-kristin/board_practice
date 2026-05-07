import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';

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
}
