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

  describe('PATCH /currency/:shortName', () => {
    test('should update currency', async () => {
      await request(app).post('/currency').send({ name: 'american dollar', shortName: 'usd', USDvalue: 1 })
      const response = await request(app).patch('/currency/USD').send({ name: 'dollar' })
      expect(response.statusCode).toBe(200)
    })
  })

  describe('GET /currency/:shortName', () => {
    test('should show currency', async () => {
      await request(app).post('/currency').send({ name: 'american dollar', shortName: 'usd', USDvalue: 1 })
      const response = await request(app).get('/currency/USD')
      expect(response.statusCode).toBe(200)
      expect(response.body.name).toEqual('american dollar')
    })
  })
  describe('GET /currency/', () => {
    test('should show currency', async () => {
      await request(app).post('/currency').send({ name: 'american dollar', shortName: 'usd', USDvalue: 1 })
      const response = await request(app).get('/currency')
      expect(response.statusCode).toBe(200)
      expect(response.body[0].name).toEqual('american dollar')
    })
  })
  describe('DELETE /currency/:shortName', () => {
    test('should delete currency', async () => {
      await request(app).post('/currency').send({ name: 'american dollar', shortName: 'usd', USDvalue: 1 })
      const response = await request(app).delete('/currency/USD')
      expect(response.statusCode).toBe(200)
      expect(response.body.deleted).toBe(true)
    })
  })

  describe('GET /currency/convert?', () => {
    test('should return the rigth value', async () => {
      await request(app).post('/currency').send({ name: 'brazilian real', shortName: 'brl', USDvalue: 5.62 })
      await request(app).post('/currency').send({ name: 'american dollar', shortName: 'usd', USDvalue: 1 })
      const response = await request(app).get('/currency/convert?from=USD&to=BRL&amount=2')
      expect(response.statusCode).toBe(200)
      expect(response.body.result).toBe(11.24)
    })
  })
})
