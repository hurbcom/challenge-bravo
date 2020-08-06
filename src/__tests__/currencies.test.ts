import request from 'supertest';
import App from '../App';

describe('currencies', () => {
    it('should insert a TST currency in the collection, that values 2 dollars.', async () => {
        const newDoc = {
            symbol: 'TST',
            conversionFactor: 2,
        };

        const res = await request(App)
            .post('/bravo/v1/currencies')
            .send(newDoc);
        expect(res.status).toBe(201);
    });

    it('should insert a TST2 currency in the collection, that values 2 dollars.', async () => {
        const newDoc = {
            symbol: 'TST2',
            conversionFactor: 2,
        };

        const res = await request(App)
            .post('/bravo/v1/currencies')
            .send(newDoc);
        expect(res.status).toBe(201);
    });

    it('should access currencies collection.', async () => {
        const res = await request(App).get('/bravo/v1/currencies');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    it('should convert TST 10.00 to TST2.', async () => {
        const res = await request(App).get(
            '/bravo/v1/convertions?from=TST&to=TST2&amount=10'
        );
        expect(res.status).toBe(200);
        expect(res.body.from).toBeDefined();
        expect(res.body.to).toBeDefined();
        expect(res.body.result).toBeDefined();
        expect(res.body.result).toBe(10);
    });

    it('should delte the TST currency in the collection.', async () => {
        const doc = {
            symbol: 'TST',
        };

        const res = await request(App).del('/bravo/v1/currencies').send(doc);
        expect(res.status).toBe(200);
    });

    it('should delte the TST2 currency in the collection.', async () => {
        const doc = {
            symbol: 'TST2',
        };

        const res = await request(App).del('/bravo/v1/currencies').send(doc);
        expect(res.status).toBe(200);
    });
});
