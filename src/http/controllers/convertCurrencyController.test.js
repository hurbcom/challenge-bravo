import { describe, expect, it } from 'vitest'
import { App } from '../../app.js'
import request from 'supertest'
import { ConvertCurrencyController } from './convertCurrency.controller.js'
import CurrencyCurrencyMongoRepository from '../../database/currencyMongoRepository.js'
import { makeMockRequest } from '../../../tests/mok-express/request-mock.js'
import { makeMockResponse } from '../../../tests/mok-express/response-mock.js'

describe('Convert Currency Controller', async () => {
  const app = new App().server
  await CurrencyCurrencyMongoRepository.connect()
  // const convertCurrencyController = new ConvertCurrencyController()

  it('should return conversion between two currencies', async () => {
    const response = await request(app)
      .get('/currency/convert/?from=BRL&to=BTC&amount=90')
      .expect('Content-Type', /json/)
      // .expect(200)
    console.log(response.body)
    expect(response.body.converted).toBeTypeOf('number')
  })

  /* it('should return an error not found', async () => {
    const response = await request(app)
      .get('/convert/?from=BRL&to=FAKE&amount=90')
      .expect('Content-Type', /json/)
      .expect(404)

    expect(response.body.message).toEqual('Currency not found: FAKE')
  })
  it('should return an error not found', async () => {
    const response = await request(app)
      .get('/convert/?from=FAKE&to=EUR&amount=90')
      .expect('Content-Type', /json/)
      .expect(404)

    expect(response.body.message).toEqual('Currency not found: FAKE')
  })
  it('should return a "from" query validation error', async () => {
    const req = makeMockRequest({ params: {}, query: { to: 'EUR', amount: 90 }, body: {} })
    const res = makeMockResponse()
    const next = () => {}
    const response = await convertCurrencyController.handler(req, res, next)

    expect(response.state.json.error).toEqual('from is required')
  })

  it('should return a "to" query validation error', async () => {
    const req = makeMockRequest({ params: {}, query: { from: 'BRL', amount: 90 }, body: {} })
    const res = makeMockResponse()
    const next = () => {}
    const response = await convertCurrencyController.handler(req, res, next)

    expect(response.state.json.error).toEqual('to is required')
  })
  it('should return a "amount" query validation error', async () => {
    const req = makeMockRequest({ params: {}, query: { to: 'EUR', from: 'BRL' }, body: {} })
    const res = makeMockResponse()
    const next = () => {}
    const response = await convertCurrencyController.handler(req, res, next)

    expect(response.state.json.error).toEqual('amount is required')
  }) */
})
