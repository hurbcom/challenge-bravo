import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { App } from '../../app.js'
import { CurrencyMongoRepository } from '../../database/currencyMongoRepository.js'

describe('Delete Currency Controller', async () => {
  const app = new App().server
  const currencyMongoRepository = new CurrencyMongoRepository()
  await currencyMongoRepository.connect()

  it('should delete an currency', async () => {
    await request(app)
      .delete('/currency/ETH')
      .expect(200)
  })

  it('should not be able deleting an currency non-existing', async () => {
    const response = await request(app)
      .delete('/currency/FAKE')
      .expect('Content-Type', /json/)
      .expect(404)

    expect(response.body).toMatchObject({ message: 'Currency not found' })
  })
})
