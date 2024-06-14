import { CurrencyRateRepository } from '@/application/repository';
import { CurrencyRate } from '@/domain/entity/';
import { CurrencyNotFoundError } from '@/domain/errors';
import { DatabaseConnection } from '@/infra/database';

export class CurrencyRateRepositoryDatabase implements CurrencyRateRepository {
  constructor(private readonly _connection: DatabaseConnection) {}

  async findByCode(code: string): Promise<CurrencyRate> {
    const [row] = await this._connection.query(
      `
      SELECT c.id, c.name, c.code, c.symbol, c.decimal_digits, r.rate
      FROM currency c
      JOIN rate r ON c.id = r.currency_id
      WHERE c.code = $1
      ORDER BY r.updated_at DESC
      LIMIT 1
      `,
      [code]
    );
    if (!row) {
      throw new CurrencyNotFoundError(code);
    }
    const currencyRate = new CurrencyRate(
      row.id,
      row.name,
      row.code,
      row.symbol,
      row.decimal_digits,
      Number(row.rate)
    );
    return currencyRate;
  }

  async add(currencyRate: CurrencyRate): Promise<void> {
    await this._connection.query(
      `
      INSERT INTO currency (id, name, code, symbol, decimal_digits)
      VALUES ($1, $2, $3, $4, $5)`,
      [
        currencyRate.id,
        currencyRate.name,
        currencyRate.code,
        currencyRate.symbol,
        currencyRate.decimalDigits,
      ]
    );

    await this._connection.query(
      `
      INSERT INTO rate (currency_id, rate)
      VALUES ($1, $2)`,
      [currencyRate.id, currencyRate.rate]
    );
  }

  async delete(code: string): Promise<void> {
    await this._connection.query(
      `
      DELETE FROM currency
      WHERE code = $1
      `,
      [code]
    );
  }
}

export default CurrencyRateRepositoryDatabase;
