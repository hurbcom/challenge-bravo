const { getCurrency } = require('../../src/_controllers')
const { createServer } = require('../../src/routes')
const useCases = require('../../src/_use-cases')
const axios = require('axios')

const sinon = require('sinon')
//chai configuration
const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')
let chaiHttp = require('chai-http');
const nock = require('nock')

chai.use(chaiHttp);
chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.should()

global.expect = chai.expect

const params = {
	from: 'USD',
	to: 'BRL',
	amount: 50,
	myCache: () => true
}

describe("GET /conversion ", () => {
	let sandbox

	beforeEach(() => {
		sandbox = sinon.createSandbox()
	})

	after(() => {
		sandbox.restore()
	})

	//test a function for a specific case
	it("returns status 200 ", async () => {
		const axiosStub = sandbox.stub(axios, "get").resolves({
			data: {
				rates: 'teste'
			}
		});

		const { statusCode, body } = await chai.request(createServer()).get('/conversion?from=USD&to=BRL&amount=10')
		expect(statusCode).to.equal(200)
	})
})