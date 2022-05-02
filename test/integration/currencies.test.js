const request = require('supertest');
const createServer = require('../../src/app');
const { generateCurrency } = require('../factories/currencies.factories');

const app = createServer();

describe('Currencies API', () => {
    describe('POST /currencies/', () => {
        it('should return 201 when registering fake currency', async () => {
            const response = await request(app)
                .post('/currencies')
                .send(generateCurrency('HURB', 1.7))
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(201);
            expect(response.body).toStrictEqual({ message: 'Successfully registered currency!' });
        });
        it('should return 201 when registering real currency', async () => {
            const response = await request(app)
                .post('/currencies')
                .send(generateCurrency('BRL'))
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(201);
            expect(response.body).toStrictEqual({ message: 'Successfully registered currency!' });
        });
        it('should return 400 when registering invalid data', async () => {
            const response = await request(app)
                .post('/currencies')
                .send(generateCurrency(null, 'test'))
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(400);
            expect(response.body).toStrictEqual({
                message: 'Currencies validation failed: rate: Cast to Number failed for value "test" (type string) at path "rate", code: Path `code` is required.',
            });
        });
        it('should return 409 when registering duplicated code', async () => {
            const response = await request(app)
                .post('/currencies')
                .send(generateCurrency('BRL'))
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(409);
            expect(response.body).toStrictEqual({ message: 'Failed to register currency: Duplicate code.' });
        });
    });
});
