import { describe, it, expect } from 'vitest'
import { makeMockRequest } from '../../../tests/mok-express/request-mock.js'
import { makeMockResponse } from '../../../tests/mok-express/response-mock.js'
import { validatorSchemaMiddleware } from './validatorSchema.middleware.js'
import { schemaValidatorConvert } from '../../utils/schemaValidator.js'

describe('validator schema middleware', async () => {
  const validatorSchema = validatorSchemaMiddleware(schemaValidatorConvert, 'query')
  it('should return a "from" query validation error', async () => {
    const req = makeMockRequest({ params: {}, query: { to: 'EUR', amount: 90 }, body: {} })
    const res = makeMockResponse()
    const next = () => {}
    const response = await validatorSchema(req, res, next)

    expect(response.state.json.error).toEqual('from is required')
  })

  it('should return a "to" query validation error', async () => {
    const req = makeMockRequest({ params: {}, query: { from: 'BRL', amount: 90 }, body: {} })
    const res = makeMockResponse()
    const next = () => {}
    const response = await validatorSchema(req, res, next)

    expect(response.state.json.error).toEqual('to is required')
  })
  it('should return a "amount" query validation error', async () => {
    const req = makeMockRequest({ params: {}, query: { to: 'EUR', from: 'BRL' }, body: {} })
    const res = makeMockResponse()
    const next = () => {}
    const response = await validatorSchema(req, res, next)

    expect(response.state.json.error).toEqual('amount is required')
  })
})
