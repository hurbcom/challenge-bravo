import { CurrencyFactory } from '../infrastructure/factories/currency.factory';
import { Currency } from '../models/currency.model';
import { injectable, inject } from 'inversify';
import { Pool } from 'pg';
import { environment } from '../environment';

@injectable()
export class CurrencyRepository {
    private pool: Pool;

    /**
     *
     */
    constructor(
        @inject(CurrencyFactory) private currencyFactory: CurrencyFactory
    ) {
        // this._currencies = {};
        this.pool = new Pool({
            user: environment.connectionStrings.postgres.user,
            host: environment.connectionStrings.postgres.host,
            database: environment.connectionStrings.postgres.database,
            password: environment.connectionStrings.postgres.password,
            port: environment.connectionStrings.postgres.port
        });

        this.seedData();
    }

    private async seedData(): Promise<void> {
        const allCurrencies = await this.getAllCurrencies();
        const currencyIds = allCurrencies.map(x => x.id);

        const baseCurrencies = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];

        const currenciesIdList = baseCurrencies.concat(currencyIds.filter(x => baseCurrencies.every(y => y !== x)));

        for (let id of currenciesIdList) {
            try {
                const currency = await this.currencyFactory.Create(id);
                await this.insertOrUpdateCurrency(currency);
            } catch (error) {
                console.log(`[WARN] Fail to insert or update currency: ${id}`);
                
            }
        }
    }

    public async insertOrUpdateCurrency(newCurrency: Currency): Promise<Currency> {
        const currencyToBeAdded = await this.currencyFactory.Create(newCurrency.id, newCurrency.usdRate);
        let sqlCommand: string;

        if (await this.getCurrencyById(currencyToBeAdded.id)) {
            sqlCommand = 'UPDATE Currencies SET UsdRate = $2, RateDate = $3 WHERE Id = $1';
        } else {
            sqlCommand = 'INSERT INTO Currencies VALUES ($1, $2, $3)';
        }

        const result = await this.pool.query(sqlCommand, [currencyToBeAdded.id, currencyToBeAdded.usdRate, currencyToBeAdded.rateDate]);
        if (result.rowCount = 1) {
            return currencyToBeAdded;
        } else {
            throw new Error('Error saving/updating data');
        }
    }

    public async getCurrencyById(id: string): Promise<Currency | null> {
        const result = await this.pool.query('SELECT * FROM Currencies WHERE Id=$1', [id.toUpperCase()]);

        if (result.rowCount == 0) return null;

        const currencyFound = result.rows[0];
        return new Currency(currencyFound.id, currencyFound.usdrate, currencyFound.ratedate);
    }

    public async getAllCurrencies(): Promise<Currency[]> {
        const result: Currency[] = [];

        const queryResult = await this.pool.query('SELECT * FROM Currencies');

        if (queryResult.rowCount == 0) return [];

        for (let currencyFound of queryResult.rows) {
            result.push(new Currency(currencyFound.id, currencyFound.usdrate, currencyFound.ratedate));
        }

        return result;
    }

    public async deleteCurrencyById(id: string): Promise<boolean> {
        const result = await this.pool.query('DELETE FROM Currencies WHERE Id=$1', [id.toUpperCase()]);
        return result.rowCount > 0;
    }
}
