import axios from "axios";
import { getRepository, Repository } from "typeorm";

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
        type = "AWSOME-API",
    }: ICreateCurrencyDTO): Promise<void> {
        const currency = this.repository.create({
            code,
            codein,
            name,
            high,
            low,
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
                        high: request.data[`${coins}USD`].high,
                        low: request.data[`${coins}USD`].low,
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
}

export { CurrencyRepository };
