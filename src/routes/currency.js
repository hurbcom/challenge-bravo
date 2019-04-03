import { Router } from 'express';
const https = require('https');

const router = Router();

router.get('/', async (req, res) => {
    if (!req.context.models.AllowedCurrencies[req.query.from])
        return res.status(422).send(`Invalid 'from' currency '${req.query.from}'`);

    if (!req.context.models.AllowedCurrencies[req.query.to])
        return res.status(422).send(`Invalid 'to' currency '${req.query.to}'`);

    if (isNaN(req.query.amount) || req.query.amount == "")
        return res.status(422).send(`Invalid amount '${req.query.amount}'`);

    const amount = parseFloat(req.query.amount);
    try {
        if (amount == 0) {
            return res.send("0");
        }
    } catch (err) {
        console.log(err);
    }

    let from = await req.context.models.CurrentCurrency.findOne({currency: req.query.from });
    if (from == null) {
        await GetCurrencyExchanges(req);
    }

    from = await req.context.models.CurrentCurrency.findOne({currency: req.query.from });
    const to = await req.context.models.CurrentCurrency.findOne({currency: req.query.to });
    if (req.query.from === 'USD') {
        return res.send(`${to.exchange*amount}`);
    }

    return res.send(`${((1/from.exchange)/(1/to.exchange))*amount}`);
});

function GetCurrencyExchanges(req) {
    https.get('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=EUR,BRL,BTC,ETH&api_key=98ce93ac44bd37842b7be20a875abc93e4d3f6dcc8cecdd779ac924de9d42388', (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', async () => {
            let result = JSON.parse(data);
            for (var c in result) {
                let obj = { currency: c, createdAt: new Date(), exchange: result[c] };
                await req.context.models.CurrentCurrency.update({ currency: c }, obj, {upsert: true, setDefaultsOnInsert: true});
                //await req.context.models.CurrentCurrency.create({ currency: c, createdAt: new Date(), exchange: result[c] });
            }
        });
    });
}

export default router;