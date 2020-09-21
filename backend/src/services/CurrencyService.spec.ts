import { CurrencyRepository } from '../repositories/CurrencyRepository'
import { CurrencyDTO } from '../models/DTO/CurrencyDTO';
import { expect } from 'chai';
import 'mocha';


describe('Testando CurrencyService', async () => {

    it('Listar Todos', async () => {
        var result = await new CurrencyRepository().Index();
        expect(result.length > 0).to.equal(true);
    });


    it('Listar um Id', async () => {
        var result = await new CurrencyRepository().Show('BRL');
        expect(result.codigo == 'BRL').to.equal(true);
    });

    it('Criar Moeda', async () => {

        var currency = new CurrencyDTO();
        currency.codigo = 'XAA';
        currency.cotacao = 99.9;
        currency.data = "2020-09-16";

        var result = await new CurrencyRepository().Create(currency);

        expect(result[0] != 0).to.equal(true);
    });

    it('Tentar Deletar Moeda Inexistente', async () => {   

        var result = await new CurrencyRepository().Delete('XXX');

        expect(result == 0).to.equal(true);
    });



});



