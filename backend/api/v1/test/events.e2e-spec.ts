import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Events Pagination (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return paginated events (first page)', async () => {
    const res = await request(app.getHttpServer())
      .get('/events?page=1')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
    // Optionally check for nextPage/links
  });

  it('should return paginated events (second page)', async () => {
    const res = await request(app.getHttpServer())
      .get('/events?page=2')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
  });

  it('should return empty data for out-of-range page', async () => {
    const res = await request(app.getHttpServer())
      .get('/events?page=9999')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('should support shard param', async () => {
    const res = await request(app.getHttpServer())
      .get('/events?page=1&shard=1')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
