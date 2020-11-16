import { Coin } from '../../entities/Coin';
import { ICoinsRespository } from '../../repositories/ICoinsRepository';

import { ICreateCoinRequestDTO } from './CreateCoinDTO';

export class CreateCoinUseCase {
  constructor(private coinsRepository: ICoinsRespository) {}

  async execute(data: ICreateCoinRequestDTO) {
    const coinAlreadyExists = await this.coinsRepository.findByName(data.name);

    if (coinAlreadyExists) {
      throw new Error('Coin already exists');
    }

    const coin = new Coin(data);

    await this.coinsRepository.save(coin);
  }
}
