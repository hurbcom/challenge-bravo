import express, { Router } from 'express';
import { createCurrency, existByName, getCurrencies } from './model/currency';
import { stringToFloat } from './utils';

const router: Router = Router();

router.get('/', async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const { from, to, amount } = request.query;

    const fromFormatted: string = String(from).toLocaleUpperCase();
    const toFormatted: string = String(to).toLocaleUpperCase();
    const amountFormatted: number = Number(amount);
    if (!from || !to || !amountFormatted) {
        response.status(422).send('Unprocessable Entity');
        return;
    }
    const currencies = await getCurrencies([fromFormatted, toFormatted]);
    const currencyFrom = currencies.find(e => e.name === fromFormatted);
    const currencyTo = currencies.find(e => e.name === toFormatted);
    if (!currencyFrom || !currencyTo) {
        response.status(200).send({ 
            ok: false
         });
        return;
    }
    const conversionValue: number = +currencyTo.value / +currencyFrom.value;
    response.status(200).send({
        ok: true,
        from: fromFormatted, 
        to: toFormatted, 
        amount: (amountFormatted * conversionValue).toFixed(2)
    });
});


router.post('/create', async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const name: string = String(request?.query?.name);
    const value: number = stringToFloat(<string>request?.query?.value);
    if (!name || !value) {
        response.status(422).send('Unprocessable Entity');
        return;
    }
    const existRecord: boolean = await existByName(name);
    let status: {
        ok: boolean,
        text: string
    };
    if (!existRecord) {
        try {
            const currency = await createCurrency({ name, value });
            status = { ok: true, text: `Currency created: ${JSON.stringify(currency.toJSON())}` };
        } catch (e) {
            status = { ok: false, text: e.message };
        }
    } else {
        status = { ok: false, text: 'Currency already exists' };
    }
    response.status(200).send({ status });
});

export { router };