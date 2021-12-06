import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { CurrencyMongoRepository } from '../../infra/db/mongodb/repositories/currency/currency-mongo-repository'
import app from '../config/app'
import request from 'supertest'
import env from '../config/env'

let currencyCollection:Collection
describe('currency routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    currencyCollection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
    await currencyCollection.deleteMany({})
  })
  describe('POST /currency', () => {
    test('should create currency', async () => {
      const response = await request(app).post('/currency').send({ name: 'american dollar', shortName: 'usd', USDvalue: 1 })
      expect(response.statusCode).toBe(201)
    })
  })
})
