import { Moeda } from "./Moeda";
import { RetornoDTO } from "./RetornoDTO";

export class CotacaoDTO {
  cotacao: CotacaoRetorno;
  retorno: RetornoDTO;
  constructor() { }
}

export class CotacaoRetorno {
  moedaOrigem: Moeda;
  moedaDestino: Moeda;
  valorParaConversao: number;
  valorConvertido: number;
  constructor() { }
}
