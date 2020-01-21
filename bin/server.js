const app = require('../src/app');
const schedule = require('../src/schedule/currencyLoad');
const currencies = require('../src/services/currenciesService');
const cacheProvider = require('../src/services/cacheService').instance();

const port = normalizaPort(process.env.PORT || '3000');

function normalizaPort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}
const {loadRates} = new currencies();

loadRates().then(response => {
    schedule.init();
    app.listen(port, function () {
        const {loadRates} = new currencies();
        console.log(`app listening on port ${port}`)
    })
});


