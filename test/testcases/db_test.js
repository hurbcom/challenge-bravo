const Currency = require('../../src/models/currencyModel');
const mongoose = require('mongoose');
const chai = require('chai');

module.exports = describe('Testes do banco de dados:', (req, res) => {

    // Antes de começar os testes, verifica se a conexão está estabelecida com o BD
    // Caso esteja, invoca done() e inicia os testes
    before(done => {
        var databaseUp = mongoose.connection.readyState
        if (databaseUp == 1) {
            /* 
                0: desconectado
                1: conectado
                2: conectando
                3: desconectando 
            */
            done();
        } 
        throw new Error('Conexão com banco de dados não estabelecida!')
    })
    
    after(done => {
        Currency.deleteMany({}, (err) => {
            done();
        });
    });

    describe('Testando gravação e leitura no banco de dados', () => {
        // Salva objeto com sigla "PHP" e nome "Peso Filipino"
        it('Nova moeda salva no banco de dados', done => {
            var currency = Currency({
                sigla: 'PHP',
                nome: 'Peso Filipino'
            });

            currency.save(done);
        });

        it('Deve retornar moeda previamente cadastrada (PHP)', done => {
            // Retorna as informações do banco de dados
            Currency.find({ 
                sigla: 'PHP' 
            })
            .then(currencies => {
                if(currencies.length === 0) { 
                    throw new Error('Moeda não encontrada!') 
                }
                done();
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || 'Erro ao recuperar moedas.'
                });
            });
        });

        it('Deve retornar todas as informações do banco de dados', done => {
            // Retorna as informações do banco de dados
            Currency.find()
            .then(currencies => {
                if(currencies.length === 0) { 
                    throw new Error('Não há dados no banco de dados!') 
                }
                done();
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || 'Erro ao recuperar moedas.'
                });
            });
        });
    });
});