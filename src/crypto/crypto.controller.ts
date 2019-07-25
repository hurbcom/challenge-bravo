import { Controller, Get, Param} from '@nestjs/common';
import { CryptoService } from './crypto.service'

/**
 * Controller que faz a chamada as aos endpoints de crypto moedas
 */
@Controller('api/v1/exchange')
export class CryptoController  {



    
    /**
     * Recebe o serviço por injeção de dependência,
     * servico que faz as chamadas as APIs externas contendo
     * informações das crypto moedas
     * @param apiService
     */
    constructor(private readonly apiService: CryptoService){};




    /**
     * Endpoint para listar as crypto coins
     */
    @Get('crypto')
    listingCrypto() {
        return this.apiService.AlternativeAPIListings();
    }//





    /**
    *  Endpoint retorna a crypto moeda selecionda
    *  @param coin
    */
    @Get('crypto/:coin')
    cryptoCoin(@Param('coin') coin: string) {
        return this.apiService.ConvertCrypto(coin);
    }//




    /**
     *  retorna a crypto moeda comparada com a moeda
     *  passada por parametro e seu respectivo valor multiplicado
     *  pela quantidade informada ex.: crypto/bitcoin/BRL/100
     *
     * @param coin
     * @param currency
     * @param qty
     */
    @Get('crypto/:coin/:currency/:qty')
    ConvertCryptoCoin(
        @Param('coin') coin: string,
        @Param('currency') currency: string,
        @Param('qty') qty: number)
    {
        return this.apiService.ConvertCryptoToCurrency(coin, currency, qty);
    }//





}//
