const axios = require('axios');

exports.ConverteMoeda = (params) => {
    let from = this.UpperCase(params.from);
    let to = this.UpperCase(params.to);

    return axios.get(`https://economia.awesomeapi.com.br/json/${from}-${to}`).then(function(resp) {
        return resp.data[0].high * params.amount;
    })
}

exports.UpperCase = (campo) => {
    return campo.toUpperCase();
}