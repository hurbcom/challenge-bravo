import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();
chai.expect();

describe('Currency Route', function () {
    describe('GET', function () {
        it('should return error invalid "from" currency', (done) => {
            chai.request(app)
                .get('/currency')
                .end((err, res) => {
                    res.should.have.status(422);
                    chai.assert.equal(res.error.text, 'Invalid "from" currency "undefined"', 'Message equals.');
                    done();
                });
        });

        it('should return error invalid "from" currency (with parameter)', (done) => {
            chai.request(app)
                .get('/currency?from=AAA')
                .end((err, res) => {
                    res.should.have.status(422);
                    chai.assert.equal(res.error.text, 'Invalid "from" currency "AAA"', 'Message equals.');
                    done();
                });
        });

        it('should return error invalid "to" currency', (done) => {
            chai.request(app)
                .get('/currency?from=BTC')
                .end((err, res) => {
                    res.should.have.status(422);
                    chai.assert.equal(res.error.text, 'Invalid "to" currency "undefined"', 'Message equals.');
                    done();
                });
        });

        it('should return error invalid "to" currency (with parameter)', (done) => {
            chai.request(app)
                .get('/currency?from=BTC&to=AAA')
                .end((err, res) => {
                    res.should.have.status(422);
                    chai.assert.equal(res.error.text, 'Invalid "to" currency "AAA"', 'Message equals.');
                    done();
                });
        });

        it('should return error invalid "amount"', (done) => {
            chai.request(app)
                .get('/currency?from=BTC&to=EUR')
                .end((err, res) => {
                    res.should.have.status(422);
                    chai.assert.equal(res.error.text, 'Invalid amount "undefined"', 'Message equals.');
                    done();
                });
        });

        it('should return error invalid "amount" (with parameter)', (done) => {
            chai.request(app)
                .get('/currency?from=BTC&to=EUR&amount=AAA')
                .end((err, res) => {
                    res.should.have.status(422);
                    chai.assert.equal(res.error.text, 'Invalid amount "AAA"', 'Message equals.');
                    done();
                });
        });

        it('should return success 0', (done) => {
            chai.request(app)
                .get('/currency?from=BTC&to=EUR&amount=0')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.assert.equal(res.text, '0');
                    done();
                });
        });

        it('should return a valid value', (done) => {
            chai.request(app)
                .get('/currency?from=BTC&to=EUR&amount=10')
                .end((err, res) => {
                    res.should.have.status(200);
                    parseFloat(res.text).should.be.a('number');
                    done();
                });
        });
    });
});