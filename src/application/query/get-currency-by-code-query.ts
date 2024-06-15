import { CurrencyNotFoundError } from '@/domain/errors';
import { DatabaseConnection } from '@/infra/database';

export class GetCurrencyByCodeQuery {
  constructor(private readonly connection: DatabaseConnection) {}

  async execute({ code }: Input): Promise<Output> {
    const [row] = await this.connection.query(
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
    return {
      id: row.currency_id,
      name: row.name,
      code: row.code,
      symbol: row.symbol,
      decimalDigits: row.decimal_digits,
      rate: Number(row.rate),
    };
  }
}

type Input = {
  code: string;
};

type Output = {
  id: string;
  name: string;
  code: string;
  symbol: string;
  decimalDigits: number;
  rate: number;
};
