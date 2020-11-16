import { ICoinsRespository } from '../../repositories/ICoinsRepository';

export class GetCoinsUseCase {
  constructor(private coinsRepository: ICoinsRespository) {}

  async execute() {
    const coins = await this.coinsRepository.index();

    return coins;
  }
}
