process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const {
  createCurrencyRepository,
} = require('../repositories/currencyRepository')
const createInitialCurrencies = require('../setup')

const should = chai.should()
chai.use(chaiHttp)

const server = app.start()
const currencyRepository = createCurrencyRepository()

describe('Currencies', () => {
  before((done) => {
    currencyRepository.removeAll().then(() => {
      done()
    })
  })

  describe('GET /currencies', () => {
    it('should GET all currencies', (done) => {
      chai
        .request(server)
        .get('/currencies')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.should.not.have.property('error')
          res.body.data.should.be.a('array')
          res.body.data.length.should.be.eql(0)
          done()
        })
    })
  })

  describe('POST /currencies', () => {
    it('should not create a currency without type field', (done) => {
      const data = {
        code: 'BRL',
        rate: '5.26',
      }
      chai
        .request(server)
        .post('/currencies')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })

    it('should not create a fictitious currency without rate field', (done) => {
      const data = {
        code: 'HURB',
        type: 'fictitious',
      }
      chai
        .request(server)
        .post('/currencies')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })

    it('should create a real currency without rate field', (done) => {
      const data = {
        code: 'BTC',
        type: 'real',
      }
      chai
        .request(server)
        .post('/currencies')
        .send(data)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.should.not.have.property('error')
          res.body.data.should.have.property('code')
          res.body.data.should.have.property('rate')
          done()
        })
    })

    it('should not create a currency that already exists', (done) => {
      const data = {
        code: 'BTC',
        type: 'real',
      }
      chai
        .request(server)
        .post('/currencies')
        .send(data)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })

    it('should not create a real currency that cannot be tracked', (done) => {
      const data = {
        code: 'HURB',
        type: 'real',
      }
      chai
        .request(server)
        .post('/currencies')
        .send(data)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })

    it('should create a currency without name field', (done) => {
      const data = {
        code: 'HURB',
        rate: 2,
        type: 'fictitious',
      }
      chai
        .request(server)
        .post('/currencies')
        .send(data)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.should.not.have.property('error')
          res.body.data.should.have.property('code')
          res.body.data.should.have.property('rate')
          done()
        })
    })
  })

  describe('GET /currencies/:code', () => {
    it('should get currency with the given code', (done) => {
      chai
        .request(server)
        .get('/currencies/BTC')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.should.not.have.property('error')
          res.body.data.should.have.property('code')
          res.body.data.should.have.property('rate')
          done()
        })
    })

    it('should get currency with the given code ignoring case', (done) => {
      chai
        .request(server)
        .get('/currencies/btc')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.should.not.have.property('error')
          res.body.data.should.have.property('code')
          res.body.data.should.have.property('rate')
          done()
        })
    })

    it('should not get currency that is not found', (done) => {
      chai
        .request(server)
        .get('/currencies/EUR')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })
  })

  describe('PUT /currencies/:code', () => {
    it('should not update a real currency', (done) => {
      const data = {
        code: 'BTC',
        rate: 0.000049,
      }
      chai
        .request(server)
        .put('/currencies/BTC')
        .send(data)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })

    it('should be possible to add a name to a fictitious currency', (done) => {
      const data = {
        name: 'HURB Coin',
        code: 'HURB',
        rate: 2,
      }
      chai
        .request(server)
        .put('/currencies/HURB')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.should.not.have.property('error')
          res.body.data.should.have.property('name')
          res.body.data.should.have.property('code')
          res.body.data.should.have.property('rate')
          done()
        })
    })

    it('should not update a currency that does not exist', (done) => {
      const data = {
        code: 'EUR',
        rate: 1,
      }
      chai
        .request(server)
        .put('/currencies/EUR')
        .send(data)
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })
  })

  describe('DELETE /currencies/:code', () => {
    it('should not delete a currency that does not exist', (done) => {
      chai
        .request(server)
        .delete('/currencies/EUR')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })

    it('should delete a existing currency', (done) => {
      chai
        .request(server)
        .delete('/currencies/HURB')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.empty
          done()
        })
    })
  })
})

describe('Conversions', () => {
  before((done) => {
    createInitialCurrencies().then(() => {
      done()
    })
  })

  describe('GET /conversion', () => {
    it('should not convert if one the currencies does not exist', (done) => {
      chai
        .request(server)
        .get('/conversion?from=BRL&to=HURB&amount=10')
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('error')
          done()
        })
    })

    it('should convert if both currencies does exist', (done) => {
      chai
        .request(server)
        .get('/conversion?from=BRL&to=USD&amount=1000')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.should.not.have.property('error')
          res.body.data.should.have.property('from')
          res.body.data.should.have.property('to')
          res.body.data.should.have.property('amount')
          res.body.data.should.have.property('result')
          done()
        })
    })
  })
})
