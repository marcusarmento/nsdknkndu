const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('responds with API message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('API do SDI está no ar!');
  });
});
