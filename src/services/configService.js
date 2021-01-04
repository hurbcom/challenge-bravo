const CurrencyModel = require('../models/currencyModel');
const SupportedCurrenciesModel = require('../models/supportedCurrenciesModel');
const AvailableCurrencies =  require('../models/availableCurrenciesModel');
const currencyExchangeService = require('../services/currencyExchangeService');

const INITIAL_CURRENCY = 'BRL';
const INITIAL_AVAILABLE_CURRENCIES = ['USD','BRL','EUR','BTC','ETH'];


exports.initialCurrencyConfiguration = async () =>{
    const {data: {rates, currency}} = await currencyExchangeService.getCurrency(INITIAL_CURRENCY);
    const queryCurrency = await CurrencyModel.findOne({alphaCode: INITIAL_CURRENCY}).exec();

    if(queryCurrency == null){
        const currencyModel = new CurrencyModel ({
            alphaCode: currency,
            rates: rates
        });
        await currencyModel.save();
    } else{
        await CurrencyModel.updateOne(
            {alphaCode: INITIAL_CURRENCY},
            {$set: { rates: rates}}
        );
    }

    const querySupportedCurrencies = await SupportedCurrenciesModel.findOne({}).exec();

    if(querySupportedCurrencies == null){
        const supportedCurrencies = new SupportedCurrenciesModel ({
            currencies: Object.keys(rates)
        });
        await supportedCurrencies.save();
    }

    const queryAvailableCurrencies = await AvailableCurrencies.findOne({}).exec();

    if(queryAvailableCurrencies == null){
        const availableCurrencies = new AvailableCurrencies ({
            currencies: INITIAL_AVAILABLE_CURRENCIES
        });

        await availableCurrencies.save();
    }
}