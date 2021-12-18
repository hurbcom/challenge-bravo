require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const prepareDatabase = async (BRL = null) => {
    console.log(`UPDATING DATABASE ${(new Date()).toISOString()}`)

    const awesomeapi = require('./src/services/awesomeapi');
    const CurrencyModel = require('./src/models/currency');

    const currencies = await awesomeapi.all();
    const codes = Object.keys(currencies);
    if (codes && codes.length > 0) {
        for (let i = 0; i < codes.length; i++) {
            const { code, bid } = currencies[codes[i]];
            try {
                console.log(`> CREATE/UPDATE REGISTER ${code} ${bid}`);
                await CurrencyModel.newCurrency(code, bid);
            } catch (error) {
                console.log(`🚀 ~ file: server.js ~ line 26 ~ prepareDatabase ~ error`, error);
            }
        }
    }
    if (BRL) {
        try {
            console.log(`> CREATE/UPDATE REGISTER BRL 1`);
            await CurrencyModel.newCurrency('BRL', 1);
        } catch (error) {
            console.log(`🚀 ~ file: server.js ~ line 36 ~ prepareDatabase ~ error`, error);
        }
    }

    setInterval(() => {
        prepareDatabase();
    }, 1000 * 60 * 60);
}
prepareDatabase(true);

const accessProtectionMiddleware = async (req, res, next) => {
    next();
};

require('./src/routes/main')(app, accessProtectionMiddleware);

app.listen(3000);