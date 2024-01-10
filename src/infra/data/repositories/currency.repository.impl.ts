import CurrencyEntity, { CurrencyEntityProps } from './../../../domain/entities/currency.entity';
import { Connection, Model } from "mongoose";
import connection from "../connection";
import PersistenceError from "../../../domain/errors/persistence.error";
import CurrencyRepository from "../../../domain/repositories/currency.repository";
import CurrencySchema from "../models/currency.schema";
import { CurrencyResponseDto } from "../../../domain/entities/dto/currency-response.dto";
import { arrayToHashString } from "../../../utils/arrayToHashString";
import { CurrencyApiResponseDto } from "../../../domain/entities/dto/currency-api-response.dto";
import defaultCurrencies from '../../../utils/default-currencies';
import getBidValues from '../../../utils/get-bid-values';
import { getRedisData, setRedisData } from '../redis/set.redis.data';
import { findOneInApi, getAllCurrenciesInApi, getCurrencyValueInBallast } from '../../../utils/get-currency-value-ballast';
export default class CurrencyRepositoryImpl implements CurrencyRepository {
    private readonly conn: Connection;
    private readonly CurrencyModel: Model<CurrencyEntityProps>;
    
    constructor(conn?: Connection) {
        this.conn = conn ?? connection();
        this.CurrencyModel = this.conn.model<CurrencyEntityProps>(
            "currencies",
            CurrencySchema
        );
        this.addSeeder();
        this.loadRedisData();
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

        const isGetFromRedisData = await getRedisData(from);
        const isGetToRedisData = await getRedisData(to);

        let getFromCurrencyValue: any = Number(
            await getBidValues(isGetFromRedisData, from)
        );

        let getToCurrencyValue: any = Number(await getBidValues(isGetToRedisData, to));

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

    async addSeeder(): Promise<any> {
        const isDataFound = await this.CurrencyModel.find()
        if(isDataFound.length > 0) {
            return
        }
        await this.CurrencyModel.insertMany(defaultCurrencies)
        .then(docs => console.log(`${docs.length} currencies have been inserted into the database.`))
        .catch(err => {
            console.error(err);
            console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
        });
    }

    async loadRedisData (isRunningAddRedisCurrencies = true) {
        if(isRunningAddRedisCurrencies){
            const currencies = await this.findAllApi();
            if(currencies){
                await setRedisData(currencies)
            }
        }
    }
}