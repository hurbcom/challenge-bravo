const fetch = require('node-fetch');

function getPageInvestingBr(endpoint){ // usd-btc
    return fetch(`https://br.investing.com/currencies/${endpoint}`).
    then(r => r.text())
}

getPageInvestingBr('usd-btc')


module.exports = {
    getPageInvestingBr
};