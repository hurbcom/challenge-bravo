import { ICoinsRespository } from '../../repositories/ICoinsRepository';

import { IUpdateCoinRequestDTO } from './UpdateCoinDTO';

export class UpdateCoinUseCase {
  constructor(private coinsRepository: ICoinsRespository) {}

  async execute(data: IUpdateCoinRequestDTO) {
    const { uid, name } = data;

    const coinUpdated = await this.coinsRepository.update({
      uid,
      name,
    });

    if (!coinUpdated) {
      throw new Error('Error in update');
    }

    return coinUpdated;
  }
}
