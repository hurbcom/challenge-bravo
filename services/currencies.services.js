const abstractApiServices = require('./abstractApi.services');

exports.getCurrencyRate = async ({ code, rate }) => {
    if (rate !== undefined && rate !== null && rate.toString().trim().length > 0) {
        return rate;
    }
    if (code === 'USD') {
        return 1;
    }
    return abstractApiServices.getExchangeRate(code);
};
