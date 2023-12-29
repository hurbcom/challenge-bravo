import { Connection, Model } from 'mongoose';
import connection from '../connection';
import CurrencyEntity, { CurrencyEntityProps } from '../../../domain/entities/currency.entity';
import PersistenceError from '../../../domain/errors/persistence.error';
import CurrencyRepository from '../../../domain/repositories/currency.repository';
import CurrencySchema from '../models/currency.schema';
import { CurrencyResponse } from '../../../domain/entities/dto/currency-response.dto';
import { arrayToHashString } from '../../../utils/arrayToHashString';
import axios from "axios";
import { CurrencyApi } from '../../../domain/entities/dto/currency-api-response.dto';

const API_URL = "https://economia.awesomeapi.com.br/json";
export default class CurrencyRepositoryImpl implements CurrencyRepository {
    private readonly conn: Connection;
    private readonly CurrencyModel: Model<CurrencyEntityProps>;

    constructor(conn?: Connection) {
        this.conn = conn ?? connection();
        this.CurrencyModel = this.conn.model<CurrencyEntityProps>('currencies', CurrencySchema);
    }

    async findBy(currencyEntityProps: Partial<CurrencyEntityProps>): Promise<CurrencyEntity[] | null> {
        try {
            const currenciesProps = await this.CurrencyModel.find(currencyEntityProps);
            if (!currenciesProps.length) return null;
            const currencies: CurrencyEntity[] = [];

            currenciesProps.forEach((currencyProps) => currencies.push(new CurrencyEntity(currencyProps.toObject())));

            return currencies;
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.findby: ${JSON.stringify(e, null, 4)}`
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
                `Error on CurrencyRepository.insert: ${JSON.stringify(e, null, 4)}`
            );
        }
    }

    async update(currencyId: string, body: any): Promise<void> {
        try {
            const updatedCurrency = await this.CurrencyModel.updateOne(
                { _id: currencyId },
                body,
            );

            if (!updatedCurrency)
                throw new PersistenceError(`Currency with id ${currencyId} not found`);
            return
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.update: ${JSON.stringify(e, null, 4)}`
            );
        }
    }

    async findAll(): Promise<any> {
        try {
            const currencies = await this.CurrencyModel.find()

            if (currencies.length < 1) {
                throw new PersistenceError(`not found`);
            }

            return currencies;
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.update: ${JSON.stringify(e, null, 4)}`
            );
        }
    }

    async findAllApi(): Promise<CurrencyResponse[] | null> {
        let codes: Array<string> = [];
        try {
            const currenciesDB = await this.CurrencyModel.find()

            if (currenciesDB.length < 1) {
                throw new PersistenceError(`not found`);
            }
            
            currenciesDB.forEach(currency => {
                if(!currency.isFictitious && currency.code !== 'BRL'){
                    codes.push(`${currency.code}-BRL`)
                }
            });

            const hashStringResult = arrayToHashString(codes);

            if(!hashStringResult){
                throw new Error()
            }

            const result = await getAllCurrenciesInApi(hashStringResult);

            return result
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.update: ${JSON.stringify(e, null, 4)}`
            );
        }
    } 

    async findByApi(code: string): Promise<CurrencyResponse | null> {
        return await findOneInApi(code)
    }   

    async convertCurrency(from: string, to: string, amount: number): Promise<CurrencyApi | null> {
        console.log("cheguei no convertCurrency ", from, to, amount)
        const ballast = "USD";
        const getFromCurrencyValue = await getCurrencyValueInBallast(
            from,
            ballast,
        );
        
        const getToCurrencyValue = await getCurrencyValueInBallast(
            to,
            ballast,
        );
        
        const fromToConversion = getFromCurrencyValue / getToCurrencyValue;
        
        return {
            from,
            to,
            bid: fromToConversion,
            ballast,
            amountFrom: amount,
            resultTo: fromToConversion * amount,
            retrieveDate: new Date(),
        } as unknown as CurrencyApi;  
    }   
}

const getAllCurrenciesInApi = async (hash: string) => {
  const finalURL = `${API_URL}/last/${hash}`
  const response = await axios.get(finalURL)
  return response.data
}

const findOneInApi = async (hash: string) => {

const finalURL = `${API_URL}/daily/${hash}/1`
  const response = await axios.get(finalURL)
  return response.data
}

const getCurrencyValueInBallast = async (from: string, to: string) => {
  const ballast = "USD";

  const { data: usdToBRL } = await axios.get(
    `${API_URL}/all/${ballast}-BRL`,
  );

  const usdToBRLResponse = usdToBRL[ballast];
  
  if (from === 'BRL') {
    return 1 / Number(usdToBRLResponse.bid);
  }

  const { data: fromToBRL } = await axios.get(
    `${API_URL}/all/${from}-BRL`,
  );
  
  const fromToBRLResponse = fromToBRL[from];

  if (!Number(fromToBRLResponse.bid)) {
    throw new Error();
  }

  return Number(fromToBRLResponse.bid) / Number(usdToBRLResponse.bid);
}