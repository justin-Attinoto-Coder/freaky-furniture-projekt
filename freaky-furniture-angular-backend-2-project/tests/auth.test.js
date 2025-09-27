const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wrong', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});
