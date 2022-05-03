const request = require('supertest');
const createServer = require('../../src/app');
const { seedDatabase } = require('./dbSeed');

const app = createServer();

describe('Exchanges API', () => {
    beforeAll(async () => {
        // load currencies
        seedDatabase();
    });
    describe('GET /exchanges/', () => {
        it('should return 200 when converting from FIAT to FIAT', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'USD', to: 'BRL', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'USD', amount: '10.00' },
                to: expect.objectContaining({ code: 'BRL' }),
            }));
            expect(response.body.to.amount).not.toBeNaN();
        });
        it('should return 200 when converting from FIAT to crypto', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'USD', to: 'BTC', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'USD', amount: '10.00' },
                to: expect.objectContaining({ code: 'BTC' }),
            }));
            expect(response.body.to.amount).not.toBeNaN();
        });
        it('should return 200 when converting from FIAT to fictitious', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'USD', to: 'HURB', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'USD', amount: '10.00' },
                to: { code: 'HURB', amount: '17.00' },
            }));
        });
        it('should return 200 when converting from crypto to FIAT', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'BTC', to: 'USD', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'BTC', amount: '10.00' },
                to: expect.objectContaining({ code: 'USD' }),
            }));
            expect(response.body.to.amount).not.toBeNaN();
        });
        it('should return 200 when converting from crypto to crypto', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'BTC', to: 'ETH', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'BTC', amount: '10.00' },
                to: expect.objectContaining({ code: 'ETH' }),
            }));
            expect(response.body.to.amount).not.toBeNaN();
        });
        it('should return 200 when converting from crypto to fictitious', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'BTC', to: 'HURB', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'BTC', amount: '10.00' },
                to: expect.objectContaining({ code: 'HURB' }),
            }));
            expect(response.body.to.amount).not.toBeNaN();
        });
        it('should return 200 when converting from fictitious to FIAT', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'HURB', to: 'USD', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'HURB', amount: '10.00' },
                to: { code: 'USD', amount: '5.88' },
            }));
        });
        it('should return 200 when converting from fictitious to crypto', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'HURB', to: 'BTC', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'HURB', amount: '10.00' },
                to: expect.objectContaining({ code: 'BTC' }),
            }));
            expect(response.body.to.amount).not.toBeNaN();
        });
        it('should return 200 when converting from fictitious to fictitious', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'HURB', to: 'FAKE', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.objectContaining({
                from: { code: 'HURB', amount: '10.00' },
                to: { code: 'FAKE', amount: '15.00' },
            }));
        });
        it('should return 400 when missing `from` query param', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ to: 'BRL', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(400);
            expect(response.body).toStrictEqual(expect.objectContaining({
                message: 'Query parameters validation failed: `from` is required.',
            }));
        });
        it('should return 400 when missing `to` query param', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'USD', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(400);
            expect(response.body).toStrictEqual(expect.objectContaining({
                message: 'Query parameters validation failed: `to` is required.',
            }));
        });
        it('should return 400 when missing `amount` query param', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'USD', to: 'BRL' })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(400);
            expect(response.body).toStrictEqual(expect.objectContaining({
                message: 'Query parameters validation failed: `amount` is required.',
            }));
        });
        it('should return 400 when `amount` query param is not a number', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'USD', to: 'BRL', amount: 'test' })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(400);
            expect(response.body).toStrictEqual(expect.objectContaining({
                message: 'Query parameters validation failed: `amount` should be a number.',
            }));
        });
        it('should return 404 when `from` is not a registered currency', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'TEST', to: 'BRL', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(404);
            expect(response.body).toStrictEqual(expect.objectContaining({
                message: 'No currency found for code \'TEST\'.',
            }));
        });
        it('should return 404 when `to` is not a registered currency', async () => {
            const response = await request(app)
                .get('/exchanges')
                .query({ from: 'USD', to: 'TEST', amount: 10 })
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(404);
            expect(response.body).toStrictEqual(expect.objectContaining({
                message: 'No currency found for code \'TEST\'.',
            }));
        });
    });
});
