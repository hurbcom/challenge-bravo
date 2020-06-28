import { Currency } from '../models/currency.model';
import { injectable } from 'inversify';
import { Pool } from 'pg';
import { environment } from '../environment';

@injectable()
export class CurrencyRepository {
    private pool: Pool;
    
    /**
     *
     */
    constructor() {
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

    private seedData(): void {
        this.insertOrUpdateCurrency(new Currency('USD', 1));
        this.insertOrUpdateCurrency(new Currency('BRL', 5.40));
        this.insertOrUpdateCurrency(new Currency('EUR', 0.89));
    }

    public async insertOrUpdateCurrency(newCurrency: Currency): Promise<Currency> {
        newCurrency.rateDate = new Date();
        let sqlCommand: string;

        if (await this.getCurrencyById(newCurrency.id)) {
            sqlCommand = 'UPDATE Currencies SET UsdRate = $2, RateDate = $3 WHERE Id = $1';
        } else {
            sqlCommand = 'INSERT INTO Currencies VALUES ($1, $2, $3)';
        }

        const result = await this.pool.query(sqlCommand, [newCurrency.id, newCurrency.usdRate, newCurrency.rateDate]);
        if (result.rowCount = 1) {
            return newCurrency;
        } else {
            throw new Error('Error saving/updating data');
        }
    }

    public async getCurrencyById (id: string): Promise<Currency | null> {
        
        const result = await this.pool.query('SELECT * FROM Currencies WHERE Id=$1', [id.toUpperCase()]);
        
        if (result.rowCount == 0) return null;

        const currencyFound = result.rows[0];
        return new Currency(currencyFound.id, currencyFound.usdrate, currencyFound.ratedate);
    }
}
