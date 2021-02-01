const request = require('supertest');
const { generateToken } = require('../../src/helpers/tokenHelpers');
const application = require('../../src/bootstrap/app');

describe('Currency tests', () => {
  it('Get Available Currencies - Authenticated', async () => {
    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });

    const response = await request(application.app)
                            .get("/api/v1/available-currencies")
                            .auth(fakeToken, { type: "bearer" });

    expect(response.status).toBe(200);
  });

  it('Get Available Currencies - Unauthenticated', async () => {
    const response = await request(application.app)
                            .get("/api/v1/available-currencies");

    expect(response.status).toBe(401);
  });

  it('Add Available Currency - Authenticated', async () => {
    const currencyName = Math.random().toString(36).substring(4).substring(0,3);

    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });

    const response = await request(application.app)
                            .post("/api/v1/add-available-currencies")
                            .send({
                              currencyName
                            })
                            .auth(fakeToken, { type: "bearer" });

    expect(response.status).toBe(201);
  });

  it('Add Available Currency - Unauthenticated', async () => {
    const currencyName = Math.random().toString(36).substring(4).substring(0,3);
    const response = await request(application.app)
                            .post("/api/v1/add-available-currencies")
                            .send({
                              currencyName
                            });

    expect(response.status).toBe(401);
  });

  it('Add Available Currency - Already exists', async () => {
    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });

    const response = await request(application.app)
                            .post("/api/v1/add-available-currencies")
                            .send({
                              currencyName : "USD"
                            })
                            .auth(fakeToken, { type: "bearer" });

    expect(response.status).toBe(200);
  });

  it('Add Available Currency - Invalid data', async () => {
    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });

    const response = await request(application.app)
                            .post("/api/v1/add-available-currencies")
                            .send({
                              currencyName : "USDASRE"
                            })
                            .auth(fakeToken, { type: "bearer" });

    expect(response.status).toBe(422);
  });

  it('Convert Amount - Authenticated', async () => {
    
    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });

    const response = await request(application.app)
                            .get("/api/v1/convert?from=USD&to=BRL&amount=123.36")
                            .auth(fakeToken, { type: "bearer" });

    expect(200).toBe(200);
  });

  it('Convert Amount - Unauthenticated', async () => {
    const response = await request(application.app)
                            .get("/api/v1/convert?from=USD&to=BRL&amount=123.36");

    expect(response.status).toBe(401);
  });

  it('Convert Amount - Invalid currency to ', async () => {
    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });

    const response = await request(application.app)
                            .get("/api/v1/convert?from=NONE&to=BRL&amount=123.36")
                            .auth(fakeToken, { type: "bearer" });

    expect(response.status).toBe(422);  
  });
  
  it('Convert Amount - Invalid currency from', async () => {
    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });

    const response = await request(application.app)
                            .get("/api/v1/convert?from=USD&to=THING&amount=123.36")
                            .auth(fakeToken, { type: "bearer" });

    expect(response.status).toBe(422);
  });

  it('Convert Amount - Invalid currency amount ', async () => {
    let randomCharId = Math.random().toString(36).substring(3);
    const fakeToken = generateToken({ id : randomCharId });

    const response = await request(application.app)
                            .get("/api/v1/convert?from=USD&to=BRL&amount=0.00")
                            .auth(fakeToken, { type: "bearer" });

    expect(response.status).toBe(422);
  });
});