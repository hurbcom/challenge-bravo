//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
describe('Convert', () => {

  /*
  * Test the /GET exchange-rate
  */
  describe('/GET exchange-rate', () => {

    it('it should GET convertedAmount Value', (done) => {
      chai.request(app)
      .get('/exchange-rate')
      .query({from:'EUR', amount:'3.2', to:'USD'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('convertedAmount');
        done();
      });
    });

    it('it should GET convertedAmount Values', (done) => {
      chai.request(app)
      .get('/exchange-rate')
      .query({from:'EUR', amount:'3', to:'USD'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('convertedAmount');
        done();
      });
    });

    it('it should GET erro because "from" is missing', (done) => {
      chai.request(app)
      .get('/exchange-rate')
      .query({ amount:'3.2', to:'USD' })
      .end((err, res) => {
        res.should.have.status(422);

        res.body.should.have.property('errors');
        done();
      });
    });

    it('it should GET erro because "to" is missing', (done) => {
      chai.request(app)
      .get('/exchange-rate')
      .query({ amount:'3.2', from:'BRL' })
      .end((err, res) => {
        res.should.have.status(422);

        res.body.should.have.property('errors');
        done();
      });
    });

    it('it should GET erro because "amount" is missing', (done) => {
      chai.request(app)
      .get('/exchange-rate')
      .query({ from:'BRL', to: 'BTC' })
      .end((err, res) => {
        res.should.have.status(422);

        res.body.should.have.property('errors');
        done();
      });
    });

    it('it should GET erro because invalid "amount"', (done) => {
      chai.request(app)
      .get('/exchange-rate')
      .query({ from:'BRL', to: 'BTC', amount: 'amount is a number?' })
      .end((err, res) => {
        res.should.have.status(422);

        res.body.should.have.property('errors');
        done();
      });
    });

    it('it should GET erro because invalid "from"', (done) => {
      chai.request(app)
      .get('/exchange-rate')
      .query({ from:'ABC', to: 'BTC', amount: '5' })
      .end((err, res) => {
        res.should.have.status(422);

        res.body.should.have.property('errors');
        done();
      });
    });

    it('it should GET erro because invalid "to"', (done) => {
      chai.request(app)
      .get('/exchange-rate')
      .query({ from:'BRL', to: 'ABC', amount: '5' })
      .end((err, res) => {
        res.should.have.status(422);

        res.body.should.have.property('errors');
        done();
      });
    });
  });


});
