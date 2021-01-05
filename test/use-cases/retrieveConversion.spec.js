const { getCurrency } = require('../../src/_controllers')
const { createServer } = require('../../src/routes')
const { retrieveConversion } = require('../../src/_use-cases')
const { supportedCurrencies, requestCurrencies, requestResponse } = require('../mocks/currency')
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

const mockParams = {
	from: 'USD',
	to: 'BRL',
	amount: 50,
	myCache: {
		get: () => supportedCurrencies,
		set: () => true
	}
}

const wrongMockParams = {
	from: 'XXX',
	to: 'BRL',
	amount: 50,
	myCache: {
		get: () => supportedCurrencies,
		set: () => true
	}
}


describe("#retrieveConversion ", () => {
	let sandbox

	beforeEach(() => {
		sandbox = sinon.createSandbox()
	})

	after(() => {
		sandbox.restore()
	})

	//test a function for a specific case
	it("returns converted value given right currency", async () => {
		const axiosStub = sandbox.stub(axios, "get").resolves({
			data: requestCurrencies
		});

		const resp = await retrieveConversion({ ...mockParams })
		expect(resp).to.deep.equal(requestResponse)
		expect(axiosStub).to.be.called
	})

	it("throws errors when given wrong currency", async () => {
		await expect(retrieveConversion({ ...wrongMockParams })).to.be.rejectedWith('CURRENCY_NOT_SUPPORTED')
	})
})