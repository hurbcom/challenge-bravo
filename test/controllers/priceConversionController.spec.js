const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

const should = chai.should();

chai.use(chaiHttp);

describe('do not pass parameters', () => {
  it('returns status 400 and bad request message', (done) => {
    chai.request(server)
      .get('/api/v1/currency_quotes')
      .end((err, res) => {
        res.should.have.status(400);
        res.should.have.property('text').eql('Bad Request');
        done();
      });
  });
});
