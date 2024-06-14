import { DatabaseConnection } from '@/infra/database';

export class ListCurrenciesQuery {
  constructor(private readonly connection: DatabaseConnection) {}

  async execute({
    currencies,
    page,
    perPage: pageSize,
    sortBy,
    sortOrder,
  }: Filters): Promise<Output> {
    const rows = await this.connection.query(
      `
      WITH latest_rates AS (
        SELECT
          r.id,
          r.currency_id,
          r.rate,
          r.updated_at,
          ROW_NUMBER() OVER (PARTITION BY r.currency_id ORDER BY r.updated_at DESC) AS rn
        FROM
          rate r
      )
      SELECT
        c.id AS currency_id,
        c.code,
        c.name,
        c.symbol,
        c.decimal_digits,
        lr.rate,
        lr.updated_at,
        COUNT(*) OVER() AS total_records
      FROM
        currency c
      JOIN
        latest_rates lr ON c.id = lr.currency_id
      WHERE
        lr.rn = 1
        AND ($1::text[] IS NULL OR c.code = ANY($1::text[]))
      ORDER BY
        CASE WHEN $2::text = 'name' THEN c.name END,
        CASE WHEN $2::text = 'code' THEN c.code END,
        CASE WHEN $2::text = 'rate' THEN lr.rate END,
        $3::text
      LIMIT $4 OFFSET (($5 - 1) * $4);
      `,
      [
        currencies?.length ? currencies : null,
        sortBy,
        sortOrder,
        pageSize,
        page,
      ]
    );
    const totalRecords = Number(rows[0].total_records);
    return {
      meta: {
        page,
        perPage: pageSize,
        pageCount: Math.ceil(totalRecords / pageSize),
        totalCount: totalRecords,
      },
      data: rows.map((row: any) => ({
        id: row.currency_id,
        name: row.name,
        code: row.code,
        symbol: row.symbol,
        decimalPoints: row.decimal_digits,
        rate: Number(row.rate),
      })),
    };
  }
}

export type Filters = {
  currencies: string[]; // BRL, USD, EUR (default all)
  page: number; // 1 (default 1)
  perPage: number; // 10 - 100 (default 10)
  sortBy: 'name' | 'code' | 'rate'; // name (default name)
  sortOrder: 'asc' | 'desc'; // asc (default asc)
};

export type Output = {
  meta: {
    page: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
  };
  data: Array<{
    id: string;
    name: string;
    code: string;
    symbol: string;
    decimalPoints: number;
    rate: number;
  }>;
};
