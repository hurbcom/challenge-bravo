import { ExchangeService } from '../services/ExchangeService';
import { ExchangeModel } from '../models/ExchangeModel'


import { expect } from 'chai';
import 'mocha';

describe('Testando ExchangeService', async () => {

    it('Converter Moedas', async () => {


        var exchangeModel = new ExchangeModel();
        exchangeModel.From = 'BRL';
        exchangeModel.To = 'EUR';
        exchangeModel.Amount = 20;

        var result = await new ExchangeService().convertCurrency(exchangeModel);

        expect(result).to.equal(3.219730508400654);
    });

});



