const Currency = require('./currency').currency;

currencyDefault = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];

async function addDefault(){
    for(currency in currencyDefault){
        currencyCheck = await checkExist(currencyDefault[currency])
        if(!currencyCheck.length){
            let db = {
                'currency': currencyDefault[currency],
            };
            addCurrency(db);
        }
    }
}

function truncate() {
    Currency.deleteMany({}, function(err) {});
}

function addCurrency(db){
    var data = new Currency(db);
    data.save();
}

async function checkExist(currency){
    return await Currency.find({ 'currency': currency }, (err, currency) => {});
}

module.exports = { truncate, addCurrency, addDefault, checkExist }