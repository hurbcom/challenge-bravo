import { Request, Response } from "express";
import { currencyService } from "../services/currencyService";
import { Conversion, Currency } from "../types/currency";
import { BadRequestError } from "../utils/apiError";

const listCurrencies = async (_: Request, res: Response) => {
    const currencies = await currencyService.getCurrencies();
    return res.status(200).json(currencies);
};

const getCurrency = async (req: Request, res: Response) => {
    const code = (req.params.code as string).toUpperCase();

    const supportedCurrencies = await currencyService.getSupportedCurrencies();

    if (!supportedCurrencies.includes(code)) {
        throw new BadRequestError("The currency is not supported");
    }

    const currency = await currencyService.getCurrency(code);

    return res.status(200).json(currency);
};

const convertCurrency = async (req: Request, res: Response) => {
    const { from, to, amount } = req.query as unknown as {
        from: string;
        to: string;
        amount: number;
    };

    const uppercaseFrom = from.toUpperCase();
    const uppercaseTo = to.toUpperCase();

    const supportedCurrencies = await currencyService.getSupportedCurrencies();

    if (!supportedCurrencies.includes(uppercaseFrom)) {
        throw new BadRequestError(
            `The currency ${uppercaseFrom} is not supported`
        );
    }

    if (!supportedCurrencies.includes(uppercaseTo)) {
        throw new BadRequestError(
            `The currency ${uppercaseTo} is not supported`
        );
    }

    const data: Conversion = {
        from: uppercaseFrom,
        to: uppercaseTo,
        amount,
    };

    const conversion: Conversion = await currencyService.getConversion(data);

    return res.status(200).json(conversion);
};

const createCurrency = async (req: Request, res: Response) => {
    const { code, name, value }: Currency = req.body;

    const currency: Currency = {
        code: code.toUpperCase(),
        name,
        value,
    };

    await currencyService.createCurrency(currency);
    return res.status(201).json(currency);
};

const updateCurrency = async (req: Request, res: Response) => {
    const { code, name, value }: Currency = req.body;
    const codeParams = (req.params.code as string).toUpperCase();

    const currency: Currency = {
        code: code.toUpperCase(),
        name,
        value,
    };

    await currencyService.updateCurrency(codeParams, currency);
    return res.status(204).send();
};

const deleteCurrency = async (req: Request, res: Response) => {
    const code = (req.params.code as string).toUpperCase();

    await currencyService.deleteCurrency(code);
    return res.status(204).send();
};

export const currencyController = {
    listCurrencies,
    getCurrency,
    convertCurrency,
    createCurrency,
    updateCurrency,
    deleteCurrency,
};
