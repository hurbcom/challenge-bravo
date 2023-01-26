import axios from "axios";
import { round } from "lodash";
import { getRepository, Repository } from "typeorm";

import { convertStringToValue } from "../../../../utils/index";
import { Currency } from "../../entities/Currency";
import { ALL_COINS, QUOTATION_API } from "../../services/connections";
import {
    ICurrencyRepository,
    ICreateCurrencyDTO,
    IConvertedCoins,
} from "../ICurrencyRepository";

class CurrencyRepository implements ICurrencyRepository {
    private repository: Repository<Currency>;

    constructor() {
        this.repository = getRepository(Currency);
    }

    async create({
        code,
        codein,
        name,
        high,
        low,
        bid,
        ask,
        type = "AWSOME-API",
    }: ICreateCurrencyDTO): Promise<void> {
        const currency = this.repository.create({
            code,
            codein,
            name,
            high,
            low,
            bid,
            ask,
            type,
        });
        await this.repository.save(currency);
    }

    async list(): Promise<Currency[]> {
        const currency = await this.repository.find();
        return currency;
    }

    async findByCode(code: string): Promise<Currency> {
        const currency = await this.repository.findOne({ code });
        return currency;
    }

    /**
     * Endpoint responsável em buscar as informções de cotação na awsomeapi
     */
    async defaultCoins(): Promise<void> {
        await Promise.all<object>(
            ALL_COINS.map(async (coins) => {
                const request = await axios.get(
                    `${QUOTATION_API}/last/${coins}-USD`
                );
                if (request.data) {
                    const awsomeApiData = this.repository.create({
                        code: request.data[`${coins}USD`].code,
                        codein: request.data[`${coins}USD`].codein,
                        name: request.data[`${coins}USD`].name,
                        high: convertStringToValue(
                            request.data[`${coins}USD`].high
                        ),
                        low: convertStringToValue(
                            request.data[`${coins}USD`].low
                        ),
                        bid: convertStringToValue(
                            request.data[`${coins}USD`].bid
                        ),
                        ask: convertStringToValue(
                            request.data[`${coins}USD`].ask
                        ),
                        type: "AWSOME-API",
                    });

                    if (await this.findByCode(awsomeApiData.code)) {
                        await this.repository
                            .createQueryBuilder("currency")
                            .update<Currency>(Currency, {
                                code: awsomeApiData.code,
                                codein: awsomeApiData.codein,
                                name: awsomeApiData.name,
                                high: awsomeApiData.high,
                                low: awsomeApiData.low,
                                bid: awsomeApiData.bid,
                                ask: awsomeApiData.ask,
                                type: awsomeApiData.type,
                            })
                            .where("currency.code = :code", {
                                code: awsomeApiData.code,
                            })
                            .updateEntity(true)
                            .execute();
                        return;
                    }
                    await this.repository.save(awsomeApiData);
                    return;
                }
                throw new Error("Cannot connect to awsomeapi");
            })
        );
    }

    async convertCoins({ from, to, amount }: IConvertedCoins): Promise<number> {
        const askFrom = await this.findByCode(from);
        const askTo = await this.findByCode(to);

        const result =
            (parseFloat(askFrom.ask) / parseFloat(askTo.ask)) *
            parseFloat(amount);

        return round(result, 5);
    }
}

export { CurrencyRepository };
