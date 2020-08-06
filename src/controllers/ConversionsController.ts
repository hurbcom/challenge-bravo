import { Request, Response } from 'express';
import CurrencySchema from '../models/CurrencySchema';

export async function getCurrencies(req: Request, res: Response) {
    try {
        const currencies = await CurrencySchema.find();
        if (!currencies) {
            return res.status(400).send({
                code: 1,
                message: 'No currencies to show.',
            });
        }

        return res.status(200).send(currencies);
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 999,
            message: 'Something went wrong. See the logs.',
        });
    }
}

export async function addCurrency(req: Request, res: Response) {
    try {
        const schema = new CurrencySchema({
            symbol: req.body.symbol,
            conversionFactor: req.body.conversionFactor,
        });

        const newDocument = await schema.save();
        return res.status(201).send(newDocument);
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 999,
            message: 'Something went wrong. See the logs.',
        });
    }
}

export async function removeCurrency(req: Request, res: Response) {
    try {
        const currency = await CurrencySchema.findOne({
            symbol: req.body.symbol,
        });

        if (!currency) {
            return res.status(400).send({
                code: 2,
                message: 'Currency does not exists.',
            });
        }

        await currency.deleteOne();
        return res.status(200).send(currency);
    } catch (error) {
        console.error(error);
        console.error(error);
        return res.status(500).send({
            code: 999,
            message: 'Something went wrong. See the logs.',
        });
    }
}

export async function convert(req: Request, res: Response) {
    try {
        const from = String(req.query.from);
        const to = String(req.query.to);
        const amount = Number(req.query.amount);

        // get the both currencies to calculate.
        const currencyFrom = await CurrencySchema.findOne({
            symbol: from,
        });

        if (!currencyFrom) {
            return res.status(400).send({
                code: 3,
                message: "Currency in 'from' parameter does not exists.",
            });
        }

        const currencyTo = await CurrencySchema.findOne({
            symbol: to,
        });

        if (!currencyTo) {
            return res.status(400).send({
                code: 4,
                message: "Currency in 'to' parameter does not exists.",
            });
        }

        // calculating
        const currencyFromDolars = amount / currencyFrom.conversionFactor;
        const converted = currencyFromDolars * currencyTo.conversionFactor;

        return res.status(200).send({
            from: from,
            to: to,
            result: converted,
        });
    } catch (error) {
        return res.status(500).send({
            code: 999,
            message: 'Something went wrong. See the logs.',
        });
    }
}