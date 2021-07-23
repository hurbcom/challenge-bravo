import { IConvertCurrencyDTO } from '../dtos/IConvertCurrencyDTO';

export interface ICurrencyConverterProvider {
  convert({ from, to, amount }: IConvertCurrencyDTO): Promise<number>;
}
