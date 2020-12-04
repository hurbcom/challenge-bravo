const index = require('../../src/index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();

const Currency = require('../../src/models/currencyModel');

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

    describe('Currencies - /GET', () => {
        it('Retorna todas as moedas salvas no banco de dados', done => {
            chai.request(index)
                .get('/api/v1/currencies/list')
                .end((err, res) => {
                    res.should.have.status(200);    
                    done();
                });
        });
    });
    
    describe('Currencies - /POST', () => {
        // A moeda não deve estar criada no BD - USD
        it('Deve criar moeda no banco de dados - USD', done => {
            chai.request(index)
                .post('/api/v1/currencies/new')
                .send({ 
                    sigla: 'USD', // Moeda suportada e digitada corretamente
                    nome: 'Dolar Americano', // Nome com mais de três digitos
                })
                .end((err, res) => {
                    res.should.have.status(200);    
                    done();
                });
        });

        // A moeda não deve estar criada no BD - BRL
        it('Deve criar moeda no banco de dados - BRL', done => {
            chai.request(index)
                .post('/api/v1/currencies/new')
                .send({ 
                    sigla: 'BRL', // Moeda suportada e digitada corretamente
                    nome: 'Real Brasileiro', // Nome com mais de três digitos
                })
                .end((err, res) => {
                    res.should.have.status(200);    
                    done();
                });
        });
    
        it('Não deve criar moeda no banco de dados - Moeda não suportada', done => {
            // Moedas suportadas = 'USD', 'BRL', 'EUR', 'BTC', 'ETH'
            chai.request(index)
                .post('/api/v1/currencies/new')
                .send({ 
                    sigla: 'PHP', // Moeda não suportada
                    nome: 'Peso Filipino', 
                })
                .end((err, res) => {
                    res.should.have.status(400);    
                    done();
                });
        });

        it('Não deve criar moeda no banco de dados - Sigla em minúsculo', done => {
            chai.request(index)
                .post('/api/v1/currencies/new')
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
                .post('/api/v1/currencies/new')
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
                .post('/api/v1/currencies/new')
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

    describe('Converter - /GET', () => {
        it('Deve converter as moedas - USD para BRL', (done) => {
            // Deve converter pois as duas moedas constam no BD
            chai.request(index)
                .get('/api/v1/convert')
                .query({from: 'USD', to: 'BRL', amount: 123})
                .end((err, res) => {
                    res.should.have.status(200);    
                    done();
                });
        });

        it('Não deve converter as moedas - USD para PHP', (done) => {
            // Não deve converter pois a moeda PHP não consta no BD
            chai.request(index)
                .get('/api/v1/convert')
                .query({from: 'USD', to: 'PHP', amount: 123})
                .end((err, res) => {
                    res.should.have.status(404);    
                    done();
                });
        });

        it('Não deve converter as moedas - Moeda de origem em minúsculo', (done) => {
            // Não deve converter pois a moeda de origem está em minúsculo
            chai.request(index)
                .get('/api/v1/convert')
                .query({from: 'usd', to: 'BRL', amount: 123})
                .end((err, res) => {
                    res.should.have.status(400);    
                    done();
                });
        });

        it('Não deve converter as moedas - Moeda de destino em minúsculo', (done) => {
            // Não deve converter pois a moeda de destino está em minúsculo
            chai.request(index)
                .get('/api/v1/convert')
                .query({from: 'USD', to: 'brl', amount: 123})
                .end((err, res) => {
                    res.should.have.status(400);    
                    done();
                });
        });

        it('Não deve converter as moedas - Valor igual a zero', (done) => {
            // Não deve converter pois o valor de conversão deve ser maior do que zero
            chai.request(index)
                .get('/api/v1/convert')
                .query({from: 'USD', to: 'BRL', amount: 0})
                .end((err, res) => {
                    res.should.have.status(400);    
                    done();
                });
        });
    });
})
