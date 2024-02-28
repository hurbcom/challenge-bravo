'use strict';

const request = require('supertest');
const app = require('../../server'); // Assuming your Express app is defined in app.js



describe('Integration tests', () => {
	it('should return status code 404 (Not Found) when the route does not exist', async () => {
		const { expect } = await import('chai');
		const response = await request(app).get('/anything');
		expect(response.status).to.equal(404);
	});

	it('should return status code 404 (Bad Request) on get exchange when the currency does not exist', async () => {
		const { expect } = await import('chai');
		const response = await request(app).get('/?from=INTTESTMON&to=USD&amount=1');
		expect(response.status).to.equal(404);
		expect(response.body.message).to.equal('Currency code \'from\' INTTESTMON not found');
	});

	it('should return status code 400 (Bad Request) on get exchange', async () => {
		const { expect } = await import('chai');
		const response = await request(app).get('/');
		expect(response.status).to.equal(400);
	});

	it('should return status code 200 (OK) on get exchange', async () => {
		const { expect } = await import('chai');
		const response = await request(app).get('/?from=USD&to=USD&amount=1');
		expect(response.status).to.equal(200);
		response.body = JSON.stringify(response.body).replace(/\s/g, ' ');
		expect(response.body).to.deep.equal('{"USD":"US$ 1,00"}');
	});

	it('should return status code 201 (Created) on create a new currency', async () => {
		const { expect } = await import('chai');
		const response = await request(app)
			.post('/')
			.set('Content-Type', 'application/json')
			.send({currency: 'MONEYTEST', ballast_usd: 0.05, crypto: false});
		expect(response.status).to.equal(201);
		expect(response.body.message).to.deep.equal('Currency created successfully');
	});

	it('should return status code 409 (Conflict) on create a new currency', async () => {
		const { expect } = await import('chai');
		const response = await request(app)
			.post('/')
			.set('Content-Type', 'application/json')
			.send({currency: 'MONEYTEST', ballast_usd: 0.05, crypto: false});
		expect(response.status).to.equal(409);
		expect(response.body.message).to.deep.equal('Currency already exists');
	});

	it('should return status code 200 (OK) on remove a currency added manually', async () => {
		const { expect } = await import('chai');
		const response = await request(app).delete('/?currency=MONEYTEST');
		expect(response.status).to.equal(200);
		expect(response.body.message).to.deep.equal('Currency deleted successfully');
	});

	it('should return status code 403 (Forbidden) on remove a imported currency', async () => {
		const { expect } = await import('chai');
		const response = await request(app).delete('/?currency=USD');
		expect(response.status).to.equal(403);
		expect(response.body.message).to.deep.equal('Not authorized delete default currencies');
	});
});