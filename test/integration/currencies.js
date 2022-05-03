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
    describe('GET /currencies/', () => {
        it('should return 200 when retrieving currencies', async () => {
            const response = await request(app)
                .get('/currencies')
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual(expect.arrayContaining([
                { code: 'HURB', rate: 1.7 },
                expect.objectContaining({ code: 'BRL' }),
            ]));
            expect(response.body[1].rate).not.toBeNaN();
        });
    });
    describe('GET /currencies/:code/', () => {
        it('should return 200 when retrieving existing currency', async () => {
            const response = await request(app)
                .get('/currencies/HURB')
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual({ code: 'HURB', rate: 1.7 });
        });
        it('should return 404 when retrieving non-existing currency', async () => {
            const response = await request(app)
                .get('/currencies/TEST')
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(404);
            expect(response.body).toStrictEqual({ message: 'No currency found for code \'TEST\'.' });
        });
    });
    describe('DELETE /currencies/:code/', () => {
        it('should return 200 when deleting existing currency', async () => {
            const response = await request(app)
                .delete('/currencies/HURB')
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual({ message: 'Successfully deleted currency!' });
        });
        it('should return 404 when deleting non-existing currency', async () => {
            const response = await request(app)
                .delete('/currencies/TEST')
                .set('Accept', 'application/json');
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.status).toEqual(404);
            expect(response.body).toStrictEqual({ message: 'No currency found for code \'TEST\'.' });
        });
    });
});
