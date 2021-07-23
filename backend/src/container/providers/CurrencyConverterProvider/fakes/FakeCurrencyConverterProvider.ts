import { IConvertCurrencyDTO } from '../dtos/IConvertCurrencyDTO';
import { ICurrencyConverterProvider } from '../models/ICurrencyConverterProvider';
import { usd, brl, eur, btc, eth } from './mocks/currencyQuotation.mock';

export class FakeCurrencyConverterProvider
  implements ICurrencyConverterProvider
{
  private usd = usd;
  private brl = brl;
  private eur = eur;
  private btc = btc;
  private eth = eth;

  public async convert({
    from,
    to,
    amount,
  }: IConvertCurrencyDTO): Promise<number> {
    if (from === to) {
      return amount;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = this[from][to] * amount;

    return result;
  }
}
