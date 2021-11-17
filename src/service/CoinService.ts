import { Coin } from "../entity/Coin";
import { CoinRepository } from "../repository/CoinRepository";

export class CoinService {

    public create = async (coin: Coin): Promise<Coin> => {

        const coinRepository = new CoinRepository()
        const createdCoin = await coinRepository.create(coin)
        console.log(createdCoin)
        return createdCoin
    }
}