process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../api/server');

var should = chai.should();
chai.use(chaiHttp);

describe('Test', function() {

  it('should get responseData on /conversion GET', function(done) {
    chai.request(server)
      .get('/conversion?from=USD&to=BTC&amount=123')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body[0].should.have.property('from');
        res.body[0].should.have.property('to');
        res.body[0].should.have.property('amount');
        res.body[0].should.have.property('converted_amount');
        res.body[0].from.should.equal('USD');
        res.body[0].from.should.equal('BTC');
        res.body[0].amount.should.equal('123');
        res.body[0].converted_amount.should.notEqual('123');
        done();
      });
  });

});