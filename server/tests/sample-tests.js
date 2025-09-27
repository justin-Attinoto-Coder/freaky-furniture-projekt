// server/tests/products.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Products API', () => {
  it('GET /api/products should return products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// server/tests/categories.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Categories API', () => {
  it('GET /api/categories should return categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// server/tests/auth.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Auth API', () => {
  it('POST /api/auth/login should fail with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wrong', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});
