import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'sqlite',
          database: 'board.sqlite',
          entities: [User, Post],
          synchronize: true,
          logging: true,
          dropSchema: true,
        };
      },
      dataSourceFactory(options) {
        if (!options) throw new Error('Invalid TypeORM options');
        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    UsersModule,
    PostsModule,
  ],

})
export class AppModule {}
