import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  async save(post: Post): Promise<Post> {
    return this.repository.save(post);
  }

  async findAll(page: number, limit: number): Promise<[Post[], number]> {
    return this.repository.findAndCount({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findPostById(id: number): Promise<Post | null> {
    return this.repository.findOne({ where: { id }, relations: ['user'] });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
