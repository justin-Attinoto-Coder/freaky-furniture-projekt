const request = require('supertest');
const app = require('../src/app');

describe('Categories API', () => {
  it('should get all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 404 for missing category', async () => {
    const res = await request(app).get('/api/categories/99999');
    expect(res.statusCode).toBe(404);
  });
});
