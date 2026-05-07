import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('POST /users (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('name 검증', () => {
    it('name이 없으면 400을 반환한다', async () => {
      // given
      const body = { email: 'test@test.com', password: 'password123' };

      // when
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(body);

      // then
      expect(response.status).toBe(400);
    });

    it('name이 빈 문자열이면 400을 반환한다', async () => {
      // given
      const body = { name: '', email: 'test@test.com', password: 'password123' };

      // when
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(body);

      // then
      expect(response.status).toBe(400);
    });
  });

  describe('email 검증', () => {
    it('email이 없으면 400을 반환한다', async () => {
      // given
      const body = { name: 'jinwoo', password: 'password123' };

      // when
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(body);

      // then
      expect(response.status).toBe(400);
    });

    it('email 형식이 잘못됐으면 400을 반환한다', async () => {
      // given
      const body = { name: 'jinwoo', email: 'notanemail', password: 'password123' };

      // when
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(body);

      // then
      expect(response.status).toBe(400);
    });
  });

  describe('password 검증', () => {
    it('password가 없으면 400을 반환한다', async () => {
      // given
      const body = { name: 'jinwoo', email: 'test@test.com' };

      // when
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(body);

      // then
      expect(response.status).toBe(400);
    });

    it('password가 빈 문자열이면 400을 반환한다', async () => {
      // given
      const body = { name: 'jinwoo', email: 'test@test.com', password: '' };

      // when
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(body);

      // then
      expect(response.status).toBe(400);
    });
  });
});
