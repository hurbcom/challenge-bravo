import mongoose from 'mongoose';
import request from 'supertest';
import { app } from "../app";
require('dotenv').config();


let server;
let _id = '';


describe('Currency Controller', () => {
    jest.setTimeout(90000);
    beforeAll(async () => {
        
        await mongoose.connect(process.env.MONGODB_REMOTE_TEST, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        server = app.listen(4000, () => {
            global.agent = request.agent(server);

        });


    });

    afterAll(async () => {
        await mongoose.model('Currency').findByIdAndDelete({ _id: _id });

        if (server) {
            await server.close();
        }
        mongoose.connections.forEach(async con => {
            await con.close();
        });

        await mongoose.disconnect();

        await new Promise<void>(resolve => setTimeout(() => resolve(), 50000));

    });

    it('Should be able to create a new currency', async () => {
        const response = await request(app)
            .post('/currency')
            .send({
                name: "Test Currency",
                code: "TCO",
                valueInUSD: 2

            })

        const { id } = response.body;
        _id = id


        expect(response.status).toBe(201);

    });


    it('should not be able to create a currency for existing code', async () => {

        const response = await request(app)
            .post('/currency')
            .send({
                name: "Test Currency",
                code: "TCO",
                valueInUSD: "2"

            })

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Currency Already Exists");
    });

    it('Should be able to get all coins', async () => {

        const response = await request(app)
            .get('/currency')
            .send()

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body).toHaveLength(6);
    });

    it('Should be able to update a currency', async () => {
        const id = _id;
        const response = await request(app)
            .put(`/currency/edit/${id}`)
            .send({
                name: "Test update",
                code: "TCO",
                valueInUSD: "2"
            })

        expect(response.status).toBe(204);

    });

    it('should be able to update to a non-existent currency', async () => {

        const id = '60f8041b75d32924f41a5dd7';
        const response = await request(app)
            .put(`/currency/edit/${id}`)
            .send({
                name: "Test update",
                code: "TCO",
                valueInUSD: "2"
            })


        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Currency does not exist");

    });

    it('Should be able to convert a currency', async () => {

        const response = await request(app)
            .get(`/currency/conversion?from=TCO&to=usd&amount=120.48`)
            .send()



        expect(response.status).toBe(200);
        expect(response.body.convertedAmount).toEqual(240.96);
        expect(response.body).toHaveProperty('currencyFrom');
        expect(response.body).toHaveProperty('currencyTo');

    });

    it('Should not be able to convert an amount that is not a number', async () => {

        const response = await request(app)
            .get(`/currency/conversion?from=btc&to=eur&amount=invalid`)
            .send()



        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid Amount!");

    });

    it('should not be able to convert from a non-existent currency', async () => {

        const response = await request(app)
            .get(`/currency/conversion?from=invalid&to=eur&amount=123.45`)
            .send()



        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid Currency!");

    });

    it('should not be able to convert to a non-existent currency', async () => {

        const response = await request(app)
            .get(`/currency/conversion?from=btc&to=invalid&amount=123.45`)
            .send()



        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid Currency!");

    });

    it('should be able to delete a currency', async () => {
        const id = _id;
        const response = await request(app)
            .delete(`/currency/${id}`)
            .send()



        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Currency Deleted');

    });

    it('should not be able to delete a currency to a non-existent currency', async () => {
        const id = '60f8041b75d32924f41a5dd7';
        const response = await request(app)
            .delete(`/currency/${id}`)
            .send()



        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Currency does not exist");

    });

    it('should be able to get current quote', async () => {

        const response = await request(app)
            .get(`/currency/currentQuote`)
            .send()



        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('Updated Quotes!');
        expect(response.body).toHaveProperty('currentsQuotes');
       

    });




});