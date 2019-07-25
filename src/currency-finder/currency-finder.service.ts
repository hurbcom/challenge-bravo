import { Injectable } from '@nestjs/common';
import { ExtApisService } from '../external-apis/ext-apis.service';
import { Currency } from '../paper/currency';


/**
 *  Classe Especializada em fazer buscas em APIS externas em busca
 * de informações sobre diversas moedas
 */
@Injectable()
export class CurrencyFinderService {

    /**
     *  Recebe por injeção de dependencia a classe de serviço
     * que faz a chamada as APIS
     * @param apiService
     */
    constructor(private readonly apiService: ExtApisService) { }


    /**
    *  Lista todas as moedas utilizando como base o USD (dóllar Americano)
    *  @param param <= opcional se especificado listará as moedas tendo como base
    * este parametro ex.: BRL
    */
    async All(param: string = 'USD'): Promise<any> {
        return await this.apiService.ExchangeRatesData(param.toUpperCase())
    }


    /**
     *  Método adcional resolve a Promise e traz os dados diretamente
     * @param param <= requerido ex.: BRL
     */
    ListAll(param): {}
    {
       return this.All(param).then(res => res).catch(err => err)
    }


    /**
     * Método faz a busca nas APIs de acordo com os parametros
     * @param _base <= requerido Moeda base para o calculo
     * @param _symbol <= requirido Moeda selecionada para a comparação
     * @param qty <= opcional valor a ser calculado
     * @param cryptoCoin <= opcional caso a moeda a ser comparada seja uma crypto-moeda
     * os dados da crypto moeda são adcionados a retorno do método
     */
    async find(_base: string, _symbol: string, qty: number = 1, cryptoCoin?: {}) {

        // A API externa recebe apenas os simbolos (USD, BRL, EUR...) em maíuscula
        let base = _base.toUpperCase()
        let symbol = _symbol.toUpperCase()

        // basta passar apenas o primeiro parametro pois o resultado virá baseado apenas nele
        let data = await this.apiService.ExchangeRatesData(base)

        /* Encontra os valores no endpoint baseado nos parametros
        aqui é utilizado o segundo parametro para filtrar o resultado solicitado */
        let baseRate = data.rates[base]
        let symbolRate = data.rates[symbol]

        /* Por padrão a API externa é baseada no Euro (EUR) e retorna todos os valores de uma vez
        exceto o Euro (que sempre retornaria 1 como resultado) neste caso se o usuario escolher
        o Euro é passado o valor 1 ausente no resultado da api externa evitando assim retornar NULL*/
        if (base === 'EUR') {
            baseRate = 1
            if (base === 'EUR' && symbol === 'EUR') {
                symbolRate = 1
            }
        }

        const currencyBase = new Currency(base, baseRate, qty)
        const comparedCurrency = new Currency(symbol, symbolRate, qty)

        /* retorna um objeto resultado da
         consulta dos parametros */
        return {
            data: {
                cryptoCoin,
                base: currencyBase,
                comparedTo: comparedCurrency,
                date: data.date
            }
        }
    }//



}//class
