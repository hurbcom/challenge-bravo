import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';


@Injectable()
export class CambioService {
  private moedas: any[];
  constructor() {
    //Preencher a lista de moedas a partir do arquivo moedas.json
    fs.readFile('src/moeda/moedas.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler arquivo de moedas:', err);
        return;
      }

      this.moedas = JSON.parse(data);
    });
  }  
  

  
  async converterMoeda(moedaOrigem: string, moedaDestino: string, valor: number): Promise<any> {
    try {
      //Se valor = 0 retorne 0
      if (valor <= 0) {
        return {"valorConvertido": 0};
      }
      //Se origem = destino retorne valor
      if (moedaOrigem === moedaDestino) {
        return {"valorConvertido": 1 * valor};
      }
//Se a moeda existir na lista de moedas ela será convertida para Real e depois para a moeda de destino
if((this.moedaExiste(moedaOrigem)) || (this.moedaExiste(moedaDestino))) {
      let valorConvertido: number;
      if(moedaOrigem === 'BRL') {
        const moedaOrigemEncontrada = this.moedas.find(m => m.nome === moedaDestino);
        valorConvertido = valor / (moedaOrigemEncontrada.valorEmReal * valor);

        return { valorConvertido };
      }
      if(moedaDestino === 'BRL') {
        const moedaOrigemEncontrada = this.moedas.find(m => m.nome === moedaOrigem);
        valorConvertido = valor * (moedaOrigemEncontrada.valorEmReal * valor);

        return { valorConvertido };
      }

      if((this.moedaExiste(moedaOrigem)) && (this.moedaExiste(moedaDestino))) {
        const moedaOrigemToBRL = this.moedas.find(m => m.nome === moedaOrigem).valorEmReal;
        const moedaDestinoToBRL = this.moedas.find(m => m.nome === moedaDestino).valorEmReal;

        valorConvertido = valor * moedaOrigemToBRL * moedaDestinoToBRL;
        return { valorConvertido };

      }

  if (this.moedaExiste(moedaOrigem)) {
    const moedaOrigemEncontrada = this.moedas.find(m => m.nome === moedaOrigem);
    const moedaOrigemToBRL = moedaOrigemEncontrada.valorEmReal;
    const response: AxiosResponse = await axios.get(`https://economia.awesomeapi.com.br/last/BRL-${moedaDestino}`);
    const taxaCambio: number = parseFloat(response.data[`BRL${moedaDestino}`].bid);
    valorConvertido = valor * moedaOrigemToBRL * taxaCambio;
  } else if (this.moedaExiste(moedaDestino)) {
    const moedaDestinoEncontrada = this.moedas.find(m => m.nome === moedaDestino);
    const moedaDestinoToBRL = moedaDestinoEncontrada.valorEmReal;
    const response: AxiosResponse = await axios.get(`https://economia.awesomeapi.com.br/last/${moedaOrigem}-BRL`);
    const taxaCambio: number = parseFloat(response.data[`${moedaOrigem}BRL`].bid);
    valorConvertido = valor / (moedaDestinoToBRL * taxaCambio);
  } else {
    throw new Error('Moedas de origem e destino não encontradas');
  }
  return { valorConvertido };
}

  //Se a moeda não existir na lista de moedas ela será convertida diretamente
      const response: AxiosResponse = await axios.get(`https://economia.awesomeapi.com.br/last/${moedaOrigem}-${moedaDestino}`);

      // Faz a solicitação à API
      
      
      // Extrai a taxa de câmbio da resposta
      const taxaCambio: number = parseFloat(response.data[`${moedaOrigem}${moedaDestino}`].bid);

      // Calcula o valor convertido
      const valorConvertido = taxaCambio * valor;

      return { valorConvertido: valorConvertido }; // Retorne o valor convertido invertido em um objeto JSON

    } catch (error) {
      // Se o erro for devido a status 404, tente a conversão com as moedas invertidas(a plataforma escolhida pode não ter a conversão direta)
      if (error.response && error.response.status === 404) {
        try {
          const responseInvertida: AxiosResponse = await axios.get(`https://economia.awesomeapi.com.br/last/${moedaDestino}-${moedaOrigem}`);
          const taxaCambioInvertida: number = parseFloat(responseInvertida.data[`${moedaDestino}${moedaOrigem}`].bid);
          const valorConvertidoInvertido = valor / taxaCambioInvertida;
          return { valorConvertido: valorConvertidoInvertido }; // Retorne o valor convertido invertido em um objeto JSON
        } catch (error) {
          if (error.response && error.response.status === 404) {
            return('Moeda não existe na base');
          } else {
            throw new Error('Erro ao converter moeda: ' + error.message);
          }        }
      }
      if (error.response && error.response.status === 404) {
        return('Moeda não existe na base');
      } else {
        throw new Error('Erro ao converter moeda: ' + error.message);
      }    }
  }



  private moedaExiste(moeda: string): boolean {
    const moedaEncontrada = this.moedas.find(m => m.nome === moeda);
  return moedaEncontrada || false;
}
  
  
}
