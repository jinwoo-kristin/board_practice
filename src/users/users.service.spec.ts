import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext();

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory() {
            return {
              type: 'sqlite',
              database: ':memory:',
              entities: [User],
              synchronize: true,
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
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    for (const entity of dataSource.entityMetadatas) {
      await dataSource.getRepository(entity.name).clear();
    }
  });

  afterAll(async () => {
    await module.close();
  });

  describe('create', () => {
    it('유저를 생성한다.', async () => {
      // given
      const dto = Object.assign(new CreateUserDto(), {
        name: 'jinwoo',
        email: 'test@test.com',
        password: 'password123',
      });

      // when
      const result = await service.create(dto);

      // then
      expect(result.id).toBeDefined();
      expect(result.name).toBe(dto.name);
      expect(result.email).toBe(dto.email);
    });
  });

  describe('findOne', () => {
    it('존재하는 id로 조회하면 UserResponseDto가 반환된다', async () => {
      // given
      const dto = Object.assign(new CreateUserDto(), {
        name: 'jinwoo',
        email: 'test@test.com',
        password: 'password123',
      });
      const created = await service.create(dto);

      // when
      const result = await service.findOne(created.id);

      // then
      expect(result.id).toBe(created.id);
      expect(result.name).toBe(dto.name);
      expect(result.email).toBe(dto.email);
    });

    it('존재하지 않는 id로 조회하면 NotFoundException이 발생한다', async () => {
      // when & then
      await expect(service.findOne(-1)).rejects.toThrow(NotFoundException);
    });
  });
});
