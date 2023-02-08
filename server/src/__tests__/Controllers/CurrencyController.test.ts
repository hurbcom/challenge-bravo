import axios from 'axios'
import { dataRedis } from 'mocks/Redis'
import request from 'supertest'

import { Server } from 'Utils/Server'
jest.mock('axios')

describe('Currency Controller', () => {
  let app = null as any

  beforeAll(async () => {
    app = await new Server().init()
  })

  describe('Retrive quotation', () => {
    it('Should return validation error', async () => {
      await request(app).get('/api/currency/').expect(400)
    })

    it('Should return an error Coin not found', async () => {
      await request(app)
        .get('/api/currency/?from=GSP&to=USD&amount=1')
        .expect(400)
    })

    it('Should return a valid quotation from BRL to USD', async () => {
      await request(app)
        .get('/api/currency/?from=BRL&to=USD&amount=1')
        .expect(200)
    })

    it('Should return a valid quotation  from USD to BRL', async () => {
      await request(app)
        .get('/api/currency/?from=USD&to=BRL&amount=1')
        .expect(200)
    })
  })

  describe('Create quotation', () => {
    it('Should return validation error', async () => {
      await request(app).post('/api/currency/').expect(400)
    })

    it('Should create a new quotation', async () => {
      await request(app)
        .post('/api/currency/')
        .send({
          from: 'CSG',
          value: 10
        })
        .expect(201)

      expect(dataRedis['CSG']).toBe(10)
    })
  })

  describe('Remove quotation', () => {
    it('Should remove a quotation created', async () => {
      await request(app).delete('/api/currency/CSG').expect(202)

      expect(dataRedis['CSG']).toBe(undefined)
    })
  })
})
