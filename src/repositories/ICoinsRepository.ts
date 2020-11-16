import { Coin } from '../entities/Coin';

export interface ICoinsRespository {
  index(): Promise<Coin[]>;
  findByName(name: string): Promise<Coin>;
  save(coin: Coin): Promise<Boolean>;
  update(coin: Coin): Promise<Boolean>;
  delete(uid: string): Promise<Boolean>;
  verifyAvailableCoin(from: string, to: string): Promise<any>;
}
