const unidadesDeMoeda = ['BTC', 'EUR', 'USD', 'BRL',  'ETH'];

exports.validar = function(params) {

    let valido = true;
    if(!params.from || !unidadesDeMoeda.includes(params.from.toUpperCase())){
        valido = false
    } else if (!params.to || !unidadesDeMoeda.includes(params.to.toUpperCase())){
        valido = false;
    } else if (!params.amount || typeof params.amount == 'number'){
        valido = false;
    }

    return valido;
};