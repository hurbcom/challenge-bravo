import { ListCurrenciesQuery } from '@/application/query/list-currencies-query';
import { Controller, Request, Response } from '@/infra/http-server/controller';

export class ListCurrenciesController implements Controller {
  constructor(private readonly listCurrencies: ListCurrenciesQuery) {}

  async handle({ query }: Request): Promise<Response> {
    try {
      const input = {
        currencies:
          query.currencies?.map((currency: string) => currency.toUpperCase()) ||
          [],
        page: Number(query.page) || 1,
        perPage: Number(query.perPage) || 10,
        sortBy: query.sortBy || 'name',
        sortOrder: query.sortOrder?.toUpperCase() || 'ASC',
      };
      const output = await this.listCurrencies.execute(input);
      return {
        statusCode: 200,
        data: output,
      };
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }
}

export default ListCurrenciesController;
