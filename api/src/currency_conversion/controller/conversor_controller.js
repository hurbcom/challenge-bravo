const request = require("request-promise");
const {endpoint, masterKey} = require('../../../config');

/**
 * Realiza a conversao, chamando a API externa para obter valores de conversao.
 * @param from sigla moeda de origem
 * @param to sigla moeda de destino
 * @param amount Valor a ser convertido
 */
exports.converter = async function (from, to, amount) {
    to = to.toUpperCase();
    from = from.toUpperCase();

    return await
        request.get(`${endpoint}?fsym=${from}&tsyms=${to}&api_key=${masterKey}`)
            .then(
                function (body) {
                    const valor = JSON.parse(body);
                    return valor[to] * amount;
                });
};
