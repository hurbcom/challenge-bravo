import { ICoinsRespository } from '../../repositories/ICoinsRepository';

import { IDeleteCoinRequestDTO } from './DeleteCoinDTO';

export class DeleteCoinUseCase {
  constructor(private coinsRepository: ICoinsRespository) {}

  async execute(data: IDeleteCoinRequestDTO) {
    const coinDeleted = await this.coinsRepository.delete(data.uid);

    if (!coinDeleted) {
      throw new Error('Coin deleted error');
    }

    return coinDeleted;
  }
}
