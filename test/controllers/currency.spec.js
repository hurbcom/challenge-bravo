const { getCurrency } = require('../../src/_controllers')
const { createServer } = require('../../src/routes')
const useCases = require('../../src/_use-cases')

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

const currencyMock = [
  'CAD', 'HKD', 'ISK', 'PHP',
  'DKK', 'HUF', 'CZK', 'GBP',
  'RON', 'SEK', 'IDR', 'INR',
  'BRL', 'RUB', 'HRK', 'JPY',
  'THB', 'CHF', 'EUR', 'MYR',
  'BGN', 'TRY', 'CNY', 'NOK',
  'NZD', 'ZAR', 'USD', 'MXN',
  'SGD', 'AUD', 'ILS', 'KRW',
  'PLN', 'teste'
]

describe("GET /currency ", () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  after(() => {
		sandbox.restore()
	})

  //test a function for a specific case
  it("returns status 200", async () => {
    const { statusCode, body } = await chai.request(createServer()).post('/currency').send({
      currency: "teste"
    })
    expect(statusCode).to.equal(200)
    expect(body).to.deep.equal(currencyMock)
  })

})