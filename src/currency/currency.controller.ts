import { Controller, Get, Param } from '@nestjs/common';
import { CurrencyService } from './currency.service'

/**
 * Controller que faz as chamdas aos endpoints de Moedas
 * e gera os endpoints com os dados
 */
@Controller('api/v1/exchange')
export class CurrencyController {


    /**
     * Recebe o serviço para chamadas a API externa
     * por injeção de dependência
     * @param apiService
     */
    constructor(private readonly apiService: CurrencyService) { };



    /**
     * Lista todas as moedas no endpoint
     */
    @Get('currency')
    All() {
        return this.apiService.All()
    }//




    /**
     *  Lista as moedas baseadas no parametro informado
     * ex.: USD, BRL
     * @param base
     */
    @Get('currency/:base')
     AllCoins(@Param('base') base: string) {
     return  this.apiService.All(base)
    }//




    /**
     * Retorn a moeda selecionada comparada com a moeda definida como base
     * ex.: currency/USD/BRL
     * @param baseSymbol
     * @param compareToSymbol
     */
    @Get('currency/:base/:compareTo')
    ConvertCurrency(
        @Param('base') baseSymbol: string,
        @Param('compareTo') compareToSymbol: string)
    {
        return this.apiService.find(baseSymbol, compareToSymbol)
    }//




    /**
     *  Retorna a moeda base e a moeda escolhida a ser comparada
     * multiplicada pela quantidade informada
     * @param baseSymbol
     * @param compareToSymbol
     * @param qty
     */
    @Get('currency/:base/:compareTo/:qty')
    ConvertCurrencyQty(
        @Param('base') baseSymbol: string,
        @Param('compareTo') compareToSymbol: string,
        @Param('qty') qty: number)
    {
        return this.apiService.find(baseSymbol, compareToSymbol, qty)
    }//



}//