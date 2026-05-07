import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @Get()
  findAll(@Query() query: PostsQueryDto) {
    return this.postsService.findAll(query);
  }
}
