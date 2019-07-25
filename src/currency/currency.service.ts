import { Injectable } from '@nestjs/common';
import { CurrencyFinderService } from '../currency-finder/currency-finder.service';


/**
 *  Classe especializada em prover o acesso as APIs externas
 * no contexto deste módulo provendo maior desacoplamento
 * e melhor divisão de responsabilidades entre os serviços
 */
@Injectable()
export class CurrencyService {



    /**
     * Recebe o serviço por injeção de dependência
     *
     * @param apiService
     */
    constructor(private readonly apiService: CurrencyFinderService){}




    /**
    *  Faz a chamada ao serviço da classe especializada para
    *  retornar os dados aos controllers
    *  @param param
    */
    All(param: string = 'USD') {
        return this.apiService.ListAll(param)
    }//all





    /**
    *   Faz a chamada ao serviço da classe especializada para
    *  retornar os dados aos controllers
    * @param base Moeda base para o calculo
    * @param symbol Moeda selecionada para a comparação
    * @param qty valor a ser calculado
    */
    async find(base: string, symbol: string, qty: number = 1) {
        return await this.apiService.find(base, symbol, qty);
    }//find




}
