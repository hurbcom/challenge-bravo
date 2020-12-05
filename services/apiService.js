const config = require("../config/keys");
const axios = require("axios");

exports.ConvertCurrency = (value) => {
    return axios.get(config.exchangerate_api.url_convert, {
                params: {
                    from: value.from,
                    to: value.to,
                    amount: value.amount,
                    places: 2
                }
    });
}