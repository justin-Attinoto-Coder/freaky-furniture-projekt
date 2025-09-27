const request = require('supertest');
const app = require('../src/app');

describe('Products API', () => {
  it('should get paginated products', async () => {
    const res = await request(app).get('/api/products?page=1&pageSize=2');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 404 for missing product', async () => {
    const res = await request(app).get('/api/products/99999');
    expect(res.statusCode).toBe(404);
  });
});
