let app = require('./app.js');
const Currency = require('./api/Models/CurrencyModel.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

var deleteAfterRun = false;

describe('Currency', () => {
before(done => {
    Currency.count({})
        .then(count => {
            if (count === 0) {
                deleteAfterRun = true;
            }})
        .then(() => {
            done();
        });

});

after(done => {
    if (deleteAfterRun) {
        Currency.deleteMany({}, (err) => {
            done();
        });
    } done();
});

describe('/GET', () => {
    it('Will return the currencies available in the database', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);    
                done();
            });
    });
});  

describe('/POST', () => {
    it('Will creat the currencie in the database', (done) => {
        chai.request(app)
            .post('/')
            .query({from: 'USD', to: 'BRL', amount: 123})
            .end((err, res) => {
                res.should.have.status(200);    
                done();
            });
    });
}); 

describe('/POST', () => {
    it('Will not convert the currencies, because ABÇ is not avaliabe', (done) => {
        chai.request(app)
            .post('/')
            .query({from: 'USD', to: 'ABÇ', amount: 123})
            .end((err, res) => {
                res.should.have.status(404);    
                done();
            });
    });
}); 

describe('/PUT', () => {
    it('Will not create the currencie in the database, body fails to match the required pattern', (done) => {
        chai.request(app)
            .put('/')
            .send({ "currency" : "123" })
            .end((err, res) => {
                res.should.have.status(400);    
                done();
            });
    });
}); 

});

  