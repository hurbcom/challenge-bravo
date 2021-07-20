import mongoose from 'mongoose';
import request from 'supertest';
import { app } from "../app";


let server;
let _id = '';


describe('Currency Controller', () => {
    jest.setTimeout(90000);
    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://admin:root@cluster0.pamgw.mongodb.net/test', {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
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
            .post('/')
            .send({
                name: "Test Coin",
                code: "TCO",
                valueInReal: "2"

            })

        const { id } = response.body;
        _id = id


        expect(response.status).toBe(201);

    });


    it('Should not be able to create a currency to code Already Exists', async () => {

        const response = await request(app)
            .post('/')
            .send({
                name: "Test Coin",
                code: "TCO",
                valueInReal: "2"

            })

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Currency Already Exists");
    });

    it('Should be able to get all coins', async () => {

        const response = await request(app)
            .get('/')
            .send()

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body).toHaveLength(6);
    });

    it('Should be able to update a currency', async () => {
        const id = _id;
        const response = await request(app)
            .put(`/edit/${id}`)
            .send({
                name: "Test update",
                code: "TCO",
                valueInReal: "2"
            })

        expect(response.status).toBe(200);

    });

    it('Should be able to conversion a currency', async () => {

        const response = await request(app)
            .get(`/conversion?from=btc&to=eur&amount=123.48`)
            .send()



        expect(response.status).toBe(200);
        expect(response.body).toEqual(3325169.8844);

    });

    it('Should not be able to convert an amount that is not a number', async () => {

        const response = await request(app)
            .get(`/conversion?from=btc&to=eur&amount=invalid`)
            .send()



        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid Amount!");

    });

    it('should not be able to convert from a non-existent currency', async () => {

        const response = await request(app)
            .get(`/conversion?from=invalid&to=eur&amount=123.45`)
            .send()



        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid Coin!");

    });

    it('should not be able to convert to a non-existent currency', async () => {

        const response = await request(app)
            .get(`/conversion?from=btc&to=invalid&amount=123.45`)
            .send()



        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid Coin!");

    });

    it('should be able to delete a currency', async () => {
        const id = _id;
        const response = await request(app)
            .delete(`/${id}`)
            .send()



        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Currency Excluída');

    });




});