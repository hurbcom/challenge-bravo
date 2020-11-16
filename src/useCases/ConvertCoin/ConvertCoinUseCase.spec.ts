import request from 'supertest';
import axios from 'axios';
import app from '../../app';
import { apiUrl } from '../../config/apiConvert';

describe('Convert Coin', () => {
  const path = '/convert';

  it('deveria retornar erro 400 porque parâmetros não existem', async (done) => {
    request(app).get(path).expect(400, done);
  });

  it('deveria retornar erro 400 se as moedas não estiverem cadastradas', async (done) => {
    const from = 'ZCF';
    const to = 'ATA';
    const amount = 10;

    request(app)
      .get(`${path}?from=${from}&to=${to}&amount=${amount}`)
      .expect(400, done);
  });

  it('deveria retornar erro 400 se apenas uma moeda está cadastrado', async (done) => {
    const from = 'ZCF';
    const to = 'BTC';
    const amount = 10;

    request(app)
      .get(`${path}?from=${from}&to=${to}&amount=${amount}`)
      .expect(400, done);
  });

  it('deveria retornar erro 400 porque não possui o amount', async (done) => {
    const from = 'ZCF';
    const to = 'BTC';

    request(app).get(`${path}?from=${from}&to=${to}`).expect(400, done);
  });

  it('deveria retornar erro 400 porque o amount não é um número', async (done) => {
    const from = 'ZCF';
    const to = 'BTC';
    const amount = 'teste';

    request(app)
      .get(`${path}?from=${from}&to=${to}&amount=${amount}`)
      .expect(400, done);
  });

  it('deveria retornar o resultado correto na conversão', async (done) => {
    const from = 'ETH';
    const to = 'BTC';
    const amount = 1;

    const responseAPI = await axios.get(
      `${apiUrl}/data/price?fsym=${from}&tsyms=${to}`
    );

    request(app)
      .get(`${path}?from=${from}&to=${to}&amount=${amount}`)
      .expect(201)
      .end((err, res) => {
        expect(Number(res.body)).toBe(responseAPI.data[to]);
        done();
      });
  });
});
