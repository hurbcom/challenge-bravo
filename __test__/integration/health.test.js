const request = require('supertest');
const { generateToken } = require('../../src/helpers/tokenHelpers');
const application = require('../../src/bootstrap/app');

describe('Health tests', () => {
  it('Health Check - Unauthenticated', async () => {
    const response = await request(application.app)
                      .get("/api/v1/health");

    expect(response.status).toBe(401);
  });

  it('Health Check - Authenticated', async () => {
    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });
    const response = await request(application.app)
                      .get("/api/v1/health").auth(fakeToken, { type: "bearer" });
            
    expect(response.status).toBe(200);
  });
});