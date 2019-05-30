const unidadesDeMoeda = ['BTC', 'EUR', 'USD', 'BRL', 'ETH'];

/**
 * Valida request
 * @param params Parametros passados para o request: from, to, amount
 * @returns {string} Mensagem de erro caso invalido, vazio caso valido
 */
exports.validate = function (params) {

    let mensagem = '';
    if (!params.from || !unidadesDeMoeda.includes(params.from.toUpperCase())) {
        mensagem = 'Parametro enviado em "from" nao corresponde as moedas aceitas';
    } else if (!params.to || !unidadesDeMoeda.includes(params.to.toUpperCase())) {
        mensagem = 'Parametro enviado em "to" nao corresponde as moedas aceitas';
    }
    else if (!params.amount || parseFloat(params.amount) == NaN) {
        mensagem = 'Parametro enviado em "amount" nao corresponde a um numero.';
    }

    return mensagem;
};