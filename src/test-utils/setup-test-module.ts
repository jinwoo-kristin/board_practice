import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';

export function setupTestModule(
  entities: { new (...args: any[]): any }[],
  providers: any[],
) {
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
              entities,
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
        TypeOrmModule.forFeature(entities),
      ],
      providers,
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await dataSource.query('PRAGMA foreign_keys = OFF');
    for (const entity of dataSource.entityMetadatas) {
      await dataSource.getRepository(entity.name).clear();
    }
    await dataSource.query('PRAGMA foreign_keys = ON');
  });

  return () => module;
}
