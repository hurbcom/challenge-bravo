import { describe, expect, it, beforeAll } from 'vitest'
import request from 'supertest'
import { App } from '../../app.js'
import { Connection } from '../../database/connection/connection.js'
import 'dotenv/config.js'

describe('Delete Currency Controller', async () => {
  const app = new App().server
  beforeAll(async () => {
    await Connection.connect(process.env.DATABASE_MONGO_TMPFS_URL)
  })

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
