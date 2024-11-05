import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import axios from 'axios';
import { AppModule } from './../src/app.module';

describe('Weather API (e2e)', () => {
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

  it('should return min, max, and avg temperatures for a given number of days', async () => {
    const days = 3; 
    
    const response = await request(app.getHttpServer())
      .get(`/api/temperature-info?days=${days}`)
      .expect(200);

    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');
    expect(response.body).toHaveProperty('avg');

    expect(typeof response.body.min).toBe('number');
    expect(typeof response.body.max).toBe('number');
    expect(typeof response.body.avg).toBe('number');

    expect(response.body.min).toBeLessThanOrEqual(response.body.max);
    expect(response.body.avg).toBeGreaterThanOrEqual(response.body.min);
    expect(response.body.avg).toBeLessThanOrEqual(response.body.max);
  });
});
