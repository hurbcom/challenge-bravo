const request = require("supertest");
const app = require('../../app');
const User = require('../../src/models/User');
const crypto = require('crypto');

beforeEach(async () => {
    const salt = process.env.HASH_SALT || 'secret';
    const hashedPassword = crypto.createHmac('sha256', salt).update('secret').digest('hex');
    await User.deleteMany({});
    await User.create({username: 'admin', password: hashedPassword});
});

test('API - login right params', async () => {
    const data = {username: 'admin', password: 'secret'};
    const response = await request(app).post("/login").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({token: /^ey/});
});

test('API - login wrong params', async () => {
    const data = {username: 'admin', password: 'wrong_password'};
    const response = await request(app).post("/login").send(data);
    expect(response.statusCode).toBe(401);
});