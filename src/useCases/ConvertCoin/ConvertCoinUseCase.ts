import { IConversionProvider } from '../../providers/IConversionProvider';
import { ICoinsRespository } from '../../repositories/ICoinsRepository';

import { IConvertCoinRequestDTO } from './ConvertCoinDTO';

export class ConvertCoinUseCase {
  constructor(
    private conversionProvider: IConversionProvider,
    private coinsRespository: ICoinsRespository
  ) {}

  async execute(data: IConvertCoinRequestDTO) {
    const count = await this.coinsRespository.verifyAvailableCoin(
      data.from,
      data.to
    );

    if (count < 2) {
      throw new Error('Moeda escolhida não é disponível para conversão');
    }

    const conversion = await this.conversionProvider.convert(data);

    return conversion;
  }
}
