import { callbackify } from 'util';

const https = require('https');

class CurrencyController {
    static async getCurrencyExchange(req, res) {
        if (!req.context.models.AllowedCurrencies[req.query.from])
            return res.status(422).send(`Invalid "from" currency "${req.query.from}"`);

        if (!req.context.models.AllowedCurrencies[req.query.to])
            return res.status(422).send(`Invalid "to" currency "${req.query.to}"`);

        if (isNaN(req.query.amount) || req.query.amount == "")
            return res.status(422).send(`Invalid amount "${req.query.amount}"`);

        const amount = parseFloat(req.query.amount);
        try {
            if (amount == 0) {
                return res.send("0");
            }
        } catch (err) {
            console.log(err);
        }

        let from = await req.context.models.CurrentCurrency.findOne({
            currency: req.query.from
        });
        if (from == null) {
            await CurrencyController.getCurrencyExchanges(req, () => CurrencyController.calculateExchange(req, res, amount));
            return;
        }

        await CurrencyController.calculateExchange(req, res, amount);
    }

    static async calculateExchange(req, res, amount) {
        const from = await req.context.models.CurrentCurrency.findOne({
            currency: req.query.from
        });
        const to = await req.context.models.CurrentCurrency.findOne({
            currency: req.query.to
        });
        if (req.query.from === 'USD') {
            return res.send(`${to.exchange*amount}`);
        }

        return res.send(`${((1/from.exchange)/(1/to.exchange))*amount}`);
    }

    static async getCurrencyExchanges(req, callback) {
        await https.get(`${process.env.CRYPTO_COMPARE_QUERY}&api_key=${process.env.CRYPTO_COMPARE_KEY}`, async (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', async () => {
                let result = JSON.parse(data);
                for (var c in result) {
                    let obj = {
                        currency: c,
                        createdAt: new Date(),
                        exchange: result[c]
                    };
                    await req.context.models.CurrentCurrency.updateOne({currency: c}, obj, {
                        upsert: true,
                        setDefaultsOnInsert: true
                    });
                }
                await callback();
            });
        });
    }
}

export default CurrencyController;