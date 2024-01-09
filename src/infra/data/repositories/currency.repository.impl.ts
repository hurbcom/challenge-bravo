import CurrencyEntity, { CurrencyEntityProps } from './../../../domain/entities/currency.entity';
import { Connection, Model } from "mongoose";
import connection from "../connection";
import PersistenceError from "../../../domain/errors/persistence.error";
import CurrencyRepository from "../../../domain/repositories/currency.repository";
import CurrencySchema from "../models/currency.schema";
import { CurrencyResponseDto } from "../../../domain/entities/dto/currency-response.dto";
import { arrayToHashString } from "../../../utils/arrayToHashString";
import axios from "axios";
import { CurrencyApiResponseDto } from "../../../domain/entities/dto/currency-api-response.dto";
import dotenv from "dotenv";
import { RedisProvider } from '../redis/redis.provider';

dotenv.config();

const API_URL = process.env.API_URL;
export default class CurrencyRepositoryImpl implements CurrencyRepository {
    private readonly conn: Connection;
    private readonly CurrencyModel: Model<CurrencyEntityProps>;

    constructor(conn?: Connection) {
        this.conn = conn ?? connection();
        this.CurrencyModel = this.conn.model<CurrencyEntityProps>(
            "currencies",
            CurrencySchema
        );
    }

    async findBy(
        currencyEntityProps: Partial<CurrencyEntityProps>
    ): Promise<CurrencyEntity[] | null> {
        try {
            const currenciesProps = await this.CurrencyModel.find(
                {code: currencyEntityProps.code}
            );

            if (!currenciesProps.length) return null;
            const currencies: CurrencyEntity[] = [];

            currenciesProps.forEach((currencyProps) =>
                currencies.push(new CurrencyEntity(currencyProps.toObject()))
            );

            return currencies;
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.findby: ${JSON.stringify(
                    e,
                    null,
                    4
                )}`
            );
        }
    }

    async deleteCurrency(code: string): Promise<void> {
        try {
            const currency = await this.CurrencyModel.findOne({code: code});
            if (!currency) {
                throw new PersistenceError();
            }
            await this.CurrencyModel.deleteOne({ code: currency.code });
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.remove: ${JSON.stringify(
                    e,
                    null,
                    4
                )}`
            );
        }
    }

    async insert(currencyEntity: CurrencyEntity): Promise<CurrencyEntity> {
        try {
            const currency = new this.CurrencyModel(currencyEntity.props);
            await currency.save();
            return new CurrencyEntity(currency.toObject());
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.insert: ${JSON.stringify(
                    e,
                    null,
                    4
                )}`
            );
        }
    }

    async update(code: string, body: CurrencyEntity): Promise<any> {
        try {
            const updatedCurrency = await this.CurrencyModel.updateOne(
                { code: code },
                body
            );

            if (!updatedCurrency)
                throw new PersistenceError(
                    `Currency with id ${code} not found`
                );
            return
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.update: ${JSON.stringify(
                    e,
                    null,
                    4
                )}`
            );
        }
    }

    async findAll(): Promise<CurrencyEntityProps[]> {
        try {
            const currencies = await this.CurrencyModel.find();

            if (currencies.length < 1) {
                throw new PersistenceError(`not found`);
            }

            return currencies;
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.update: ${JSON.stringify(
                    e,
                    null,
                    4
                )}`
            );
        }
    }

    async findAllApi(): Promise<CurrencyResponseDto[] | null> {
        let codes: Array<string> = [];
        try {
            const currenciesDB = await this.CurrencyModel.find();

            if (currenciesDB.length < 1) {
                throw new PersistenceError(`not found`);
            }

            currenciesDB.forEach(async (currency) => {
                if (!currency.isFictitious) {
                    codes.push(`${currency.code}-BRL`);
                }
                if(currency.isFictitious){
                    await setRedisData(currenciesDB)
                }
            });

            const hashStringResult = arrayToHashString(codes);

            if (!hashStringResult) {
                throw new Error();
            }

            const currenciesApiResult = await getAllCurrenciesInApi(
                hashStringResult
            );
            
            await setRedisData(currenciesApiResult);

            return currenciesApiResult;
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.update: ${JSON.stringify(
                    e,
                    null,
                    4
                )}`
            );
        }
    }

    async findByApi(code: string): Promise<CurrencyResponseDto | null> {
        return await findOneInApi(code);
    }

    async convertCurrency(
        from: string,
        to: string,
        amount: number
    ): Promise<CurrencyApiResponseDto | null> {
        const ballast = "USD";
        //this function populate redis with currencies if registred in application
        await this.findAllApi();
        const isGetFromRedisData = await getRedisData(from);
        const isGetToRedisData = await getRedisData(to);

        const currencyFromData = isGetFromRedisData;
        const currencyToData = isGetToRedisData;

        let getFromCurrencyValue = Number(
            await getBidValues(currencyFromData, from)
        );
        let getToCurrencyValue = Number(await getBidValues(currencyToData, to));

        if (!getFromCurrencyValue) {
            getFromCurrencyValue = await getCurrencyValueInBallast(
                from,
                ballast
            );
        }

        if (!getToCurrencyValue) {
            getToCurrencyValue = await getCurrencyValueInBallast(to, ballast);
        }

        const fromToConversion = getFromCurrencyValue / getToCurrencyValue;

        return {
            from,
            to,
            bid: fromToConversion,
            ballast,
            amountFrom: amount,
            resultTo: fromToConversion * amount,
            retrieveDate: new Date(),
        } as unknown as CurrencyApiResponseDto;
    }
}

const getAllCurrenciesInApi = async (hash: string) => {
    const finalURL = `${API_URL}/last/${hash}`;
    const response = await axios.get(finalURL);
    return response.data;
};

const findOneInApi = async (hash: string) => {
    const finalURL = `${API_URL}/daily/${hash}/1`;
    const response = await axios.get(finalURL);
    return response.data;
};

const getCurrencyValueInBallast = async (from: string, to: string) => {
    const ballast = "USD";
    const { data: usdToBRL } = await axios.get(`${API_URL}/all/${ballast}-BRL`);

    const usdToBRLResponse = usdToBRL[ballast];

    if (from === "BRL") {
        return 1 / Number(usdToBRLResponse.bid);
    }

    const { data: fromToBRL } = await axios.get(`${API_URL}/all/${from}-BRL`);

    const fromToBRLResponse = fromToBRL[from];

    if (!Number(fromToBRLResponse.bid)) {
        throw new Error();
    }

    return Number(fromToBRLResponse.bid) / Number(usdToBRLResponse.bid);
};

const getRedisData = async (code: string): Promise<any> => {
    const redisProvider = new RedisProvider()
        const currency =  await redisProvider.get(code);
        redisProvider.disconnect()
        return currency;
};
    
const setRedisData = async (
    currencies: CurrencyEntityProps[]
    ): Promise<void> => {
        const redisProvider = new RedisProvider()
        for (const i in currencies) {
            const { code, bid } = currencies[i]
            await redisProvider.set(code, bid);
        }
    redisProvider.disconnect();
};

const getBidValues = async (data: any, key: string) => {
    for (const currencyKey in data) {
        const currency = data[currencyKey];
        if (currency.code === key) {
            return currency.bid;
        }
    }
    return undefined;
};
