import { IConvertCoinRequestDTO } from '../useCases/ConvertCoin/ConvertCoinDTO';

export interface IConversionProvider {
  convert(request: IConvertCoinRequestDTO): Promise<string>;
}
