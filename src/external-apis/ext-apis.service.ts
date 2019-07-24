import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';



/**
 *  Classe a ser usada como serviço para ser injetada em
 * Controllers e em outras classes especializadas como 'services'
 * para efetuar chamadas a APIS externas
 */
@Injectable()
export class ExtApisService {


    /**
     *  Recebe por injeção de dependencia o serviço
     *  para fazer chamadas aos endpoints
     */
    constructor(private readonly httpService: HttpService) { }



    /**
     *  Faz acesso ao endpoint e retorna a Promise para ser resolvida em
     *  outros pontos do código quando necessário
     *  @param :string <= ex USD
     */
    ExchangeRatesAPI(param: string):
        Observable<AxiosResponse<any[]>> {
        return this.httpService.get(`https://api.exchangeratesapi.io/latest?base=${param}`)
    }//


    /**
     *  Faz o acesso ao endpoint resolve a Promisse e retorna os dados
     * @param :string <= ex USD
     *
     */
    ExchangeRatesData(param: string)
    {
        return this.ExchangeRatesAPI(param)
          .toPromise()
             .then(res => (res.data))
                .catch(err => err);
    }//


    /**
     *  lista convertendo para usd
     *  https://api.alternative.me/v2/ticker/?convert=USD/
     *
     *  seleciona a moeda por id e por nome 'website_slug'
     *  https://api.alternative.me/v2/ticker/1/
     *  https://api.alternative.me/v2/ticker/bitcoin/
     *  @param: string  <= ex bitcoin, 1
     *
     */
    AlternativeAPI(param: string):
        Observable<AxiosResponse<any[]>>
    {
        return this.httpService.get(`https://api.alternative.me/v2/ticker/${param}/?convert=USD/`)
    }//


    /**
    *
    *  lista contendo todas as crypto moedas
    *  https://api.alternative.me/v2/listings/
    */
    AlternativeListingAPI():
    Observable<AxiosResponse<any[]>>
    {
        return this.httpService.get(`https://api.alternative.me/v2/listings/`)
    }//


    /**
    *  Alternativa para retornar diretamente os dados do endpoint
    */
    AlternativeListing()
    {
        return this.AlternativeListingAPI()
            .toPromise()
              .then(res => (res.data))
                .catch(err => err);
    }//


    /**
     *   Tem a função de encontrar e retornar a crypto moeda
     *   com seu valor baseado em USD (Dóllar Americano)
     *
     */
     async AlternativeConvert(param: string )
    {
       /* Lista todas as crypto moedas */
       let listing = await this.AlternativeListing()

       /* encontra a moeda baseada no parametro */
       let coin = listing.data.filter((el) => (el.website_slug == param.toLowerCase() || el.id == param))[0];

        return this.AlternativeAPI(coin.id)
           .toPromise()
              .then(res => res.data["data"][coin.id])
                 .catch(err => err);
    }//


}//class
