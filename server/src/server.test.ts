import request from 'supertest';
import app from './server';

describe('Server API', () => {
  it('health check returns ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('staff endpoint returns array', async () => {
    const response = await request(app).get('/api/staff');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
}); 