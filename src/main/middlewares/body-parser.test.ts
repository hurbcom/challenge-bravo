import request from 'supertest'
import app from '../config/app'

app.post('/test_body_parser', (req, res) => {
  res.send(req.body)
})
describe('Body Parser Middleware', () => {
  test('Should parse request body as JSON', async () => {
    await request(app).post('/test_body_parser').send({ name: 'Yan' }).expect({ name: 'Yan' })
  })
})
