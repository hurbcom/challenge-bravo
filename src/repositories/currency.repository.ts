import { CurrencyFactory } from '../infrastructure/factories/currency.factory';
import { Currency } from '../models/currency.model';
import { injectable, inject } from 'inversify';
import { Pool } from 'pg';
import { environment } from '../environment';

@injectable()
export class CurrencyRepository {
    private pool: Pool;

    /**
     *  Constructor for Currency Repository
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

    /**
     * Seeds data in the database
     */
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

    /**
     * Inserts or updates a currency in the system
     * @param newCurrency Currency to be added or updated
     */
    public async insertOrUpdateCurrency(newCurrency: Currency): Promise<Currency> {
        const currencyToBeAdded = await this.currencyFactory.Create(newCurrency.id, newCurrency.usdRate);
        let sqlCommand: string;

        // Check if the new currency already exists and creates the command to be used
        if (await this.getCurrencyById(currencyToBeAdded.id)) {
            sqlCommand = 'UPDATE Currencies SET UsdRate = $2, RateDate = $3 WHERE Id = $1';
        } else {
            sqlCommand = 'INSERT INTO Currencies VALUES ($1, $2, $3)';
        }

        // Runs the command
        const result = await this.pool.query(sqlCommand, [currencyToBeAdded.id, currencyToBeAdded.usdRate, currencyToBeAdded.rateDate]);

        // Check if any rows were affected and return the result
        if (result.rowCount = 1) {
            return currencyToBeAdded;
        } else {
            throw new Error('Error saving/updating data');
        }
    }

    /**
     * Returns a Currency object with the provided id
     * @param id Currency id
     */
    public async getCurrencyById(id: string): Promise<Currency | null> {
        const result = await this.pool.query('SELECT * FROM Currencies WHERE Id=$1', [id.toUpperCase()]);

        if (result.rowCount == 0) return null;

        const currencyFound = result.rows[0];
        return new Currency(currencyFound.id, currencyFound.usdrate, currencyFound.ratedate);
    }

    /**
     * Returns a collection with all the currencies in the system
     */
    public async getAllCurrencies(): Promise<Currency[]> {
        const result: Currency[] = [];

        const queryResult = await this.pool.query('SELECT * FROM Currencies');

        if (queryResult.rowCount == 0) return [];

        for (let currencyFound of queryResult.rows) {
            result.push(new Currency(currencyFound.id, currencyFound.usdrate, currencyFound.ratedate));
        }

        return result;
    }

    /**
     * Deletes a currency from the system that matches the provided id
     * @param id Currency id
     */
    public async deleteCurrencyById(id: string): Promise<boolean> {
        const result = await this.pool.query('DELETE FROM Currencies WHERE Id=$1', [id.toUpperCase()]);
        return result.rowCount > 0;
    }
}
