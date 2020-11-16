import axios from 'axios';
import { IConversionProvider } from '../IConversionProvider';
import { IConvertCoinRequestDTO } from '../../useCases/ConvertCoin/ConvertCoinDTO';
import { getData, setData } from '../../config/redis';
import { apiUrl, apiToken } from '../../config/apiConvert';

export class ConversionProvider implements IConversionProvider {
  async convert(request: IConvertCoinRequestDTO): Promise<string> {
    try {
      const { from, to, amount } = request;

      const cachedResult = await getData(`Cache - ${from}:${to}`);
      if (cachedResult) return (amount * cachedResult).toFixed(8);

      const res = await axios.get(
        `${apiUrl}/data/price?fsym=${from}&tsyms=${to}`,
        {
          headers: {
            Authorization: `Apikey ${apiToken}`,
          },
        }
      );

      const result = res.data[to];

      if (!result) {
        throw new Error('Não conseguimos fazer a conversão');
      }

      // Salva a informação no cache
      await setData(`Cache - ${from}:${to}`, result);

      return (result * amount).toFixed(8);
    } catch (error) {
      throw new Error(error);
    }
  }
}
