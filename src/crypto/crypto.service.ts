import { Injectable } from '@nestjs/common';
import { ExtApisService } from '../external-apis/ext-apis.service';
import { CurrencyFinderService } from '../currency-finder/currency-finder.service';


/**
 *  Classe especializada em prover o acesso as APIs externas
 * no contexto deste módulo provendo maior desacoplamento
 * e melhor divisão de responsabilidades entre os serviços
 */
@Injectable()
export class CryptoService {


    /**
     * Recebe por injeção de dependência os serviços especializados
     * @param apiService acesso direto aos endpoints
     * @param currencyFinder acesso à funcionalidades especializadas
     */
    constructor(
        private readonly apiService: ExtApisService,
        private readonly currencyFinder: CurrencyFinderService
        ) {}



    /**
     * Retorna a moeda selecionada de acordo com o parametro
     * informado
     * @param param
     */
    ConvertCrypto(param: string) {
        return  this.apiService.AlternativeConvert(param)
    }//


    
    /**
     * Listar as crypto moedas
     */
    AlternativeAPIListings() {
        return this.apiService.AlternativeListing()
    }//



    /**
     * retorna a crypto moeda e a moeda selecionada
     * fazendo o calculo de conversão baseada primeiramente
     * em USD (Dóllar Americano) e em outra moeda especificada
     * por parametro
     * @param coin
     * @param currency
     * @param qty
     */
    async ConvertCryptoToCurrency(coin: string, currency: string, qty: number = 1) {

        /* Encontra a crypto moeda baseado no primeiro parametro */
        let cryptoCoin = await this.ConvertCrypto(coin);

        /* Retorna o resultado da moeda encontrada multiplicada pelo valor
         informado por parametro */
        let cryptoValue = cryptoCoin.quotes.USD.price * qty;

        /* Faz chamada ao serviço para executar as operações e retornar os dados
         a Controller e seu respectivo endpoint */
        return this.currencyFinder.find('USD', currency, cryptoValue, { coin, qty })
    }//






}
