const index = require('../src/index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();

const Currency = require('../src/models/currencyModel');

chai.use(chaiHttp);

var deleteAfter = false;

module.exports = describe('Testes dos endpoints da API:', () => {

    before(done => {
        Currency.countDocuments({})
            .then(count => {
                if (count === 0) {
                    deleteAfter = true;
                }
            })
            .then(() => {
                done();
            });
    });
    
    after(done => {
        if (deleteAfter) {
            Currency.deleteMany({}, (err) => {
                done();
            });
        } else {
            done();
        }
    });

    describe('/GET', () => {
        it('Retorna todas as moedas salvas no banco de dados', done => {
            chai.request(index)
                .get('/api/currencies/list')
                .end((err, res) => {
                    res.should.have.status(200);    
                    done();
                });
        });
    });
    
    describe('/POST', () => {
        // A moeda não deve estar criada no BD
        it('Deve criar moeda no banco de dados', done => {
            chai.request(index)
                .post('/api/currencies/new')
                .send({ 
                    sigla: 'ETH', // Moeda suportada e digitada corretamente
                    nome: 'Ethereum', // Nome com mais de três digitos
                })
                .end((err, res) => {
                    res.should.have.status(200);    
                    done();
                });
        });
    
        it('Não deve criar moeda no banco de dados - Moeda não suportada', done => {
            // Moedas suportadas = 'USD', 'BRL', 'EUR', 'BTC', 'ETH'
            chai.request(index)
                .post('/api/currencies/new')
                .send({ 
                    sigla: 'PHP', // Não suportada
                    nome: 'Peso Filipino', 
                })
                .end((err, res) => {
                    res.should.have.status(400);    
                    done();
                });
        });

        it('Não deve criar moeda no banco de dados - Sigla em minúsculo', done => {
            chai.request(index)
                .post('/api/currencies/new')
                .send({ 
                    sigla: 'eth', // As siglas devem ser digitadas em maiúsculo
                    nome: 'Ethereum', 
                })
                .end((err, res) => {
                    res.should.have.status(400);    
                    done();
                });
        });

        it('Não deve criar moeda no banco de dados - Sigla inválida', done => {
            chai.request(index)
                .post('/api/currencies/new')
                .send({ 
                    sigla: 'ET', // As siglas devem possuir três caracteres
                    nome: 'Ethereum', 
                })
                .end((err, res) => {
                    res.should.have.status(400);    
                    done();
                });
        });

        it('Não deve criar moeda no banco de dados - Nome inválido', done => {
            chai.request(index)
                .post('/api/currencies/new')
                .send({ 
                    sigla: 'ETH',
                    nome: 'Et', // O nome tem que possuir mais de três digitos
                })
                .end((err, res) => {
                    res.should.have.status(400);    
                    done();
                });
        });
    });
})
