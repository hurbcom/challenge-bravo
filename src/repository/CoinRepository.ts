import { connection } from "../connection";
import { Coin } from "../entity/Coin";

export class CoinRepository {

    create = async (coin: Coin): Promise<any> => {
        const result = await connection.raw(`

            INSERT INTO hurb_coin (code, name, valueInUSD) VALUES ('${coin.code}', '${coin.name}','${coin.valueInUSD}')
        `)

        return result[0][0]
    }
}