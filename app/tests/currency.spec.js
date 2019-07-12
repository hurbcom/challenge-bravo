const assert = require('assert');
const request = require('request');

describe('Currency.js', () => {
    it('Resultado de conversão da requisição da API (cryptocompare)', async () => {
        const from = 'USD';
        const to = 'BRL';
        /**
         *  Apesar de não ser uma boa prática a utilização de testes de unidade
         *  para requisições, faço aqui só checar o código de obtenção, parse e resultado do valor.
         */
        const URL = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;

        const promiseResult = new Promise((resolve, reject) => {
            request(URL, {}, (error, response, body) => {
                if (error) reject(error);

                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(error);
                }
            });
        })

        const result = await promiseResult;
        assert.equal(!isNaN(result[to]), true);
    });

    it('Validação dos campos e transformação', () => {
        const VALID_CURRENCY = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];

        let from = 'usd';
        let to = 'brl';
        const amount = "1,00"

        from = from.toUpperCase();
        to = to.toUpperCase();

        assert.equal(from, 'USD');
        assert.equal(to, 'BRL');

        assert.equal(!VALID_CURRENCY.includes(from), false);
        assert.equal(!VALID_CURRENCY.includes(to), false);
        assert.equal(!(/^[0-9]+(\.[0-9]{1,2})?$/gm.test(amount)), true);
    });
});