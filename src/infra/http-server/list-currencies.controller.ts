import { ListCurrenciesQuery } from '@/application/query/list-currencies-query';
import { HttpServer } from '@/infra/http-server';

export class ListCurrenciesController {
  constructor(
    readonly httpServer: HttpServer,
    readonly listCurrencies: ListCurrenciesQuery
  ) {
    httpServer.register('get', '/currencies', async ({ query }) => {
      try {
        const input = {
          currencies:
            query.currencies?.map((currency: string) =>
              currency.toUpperCase()
            ) || [],
          page: Number(query.page) || 1,
          perPage: Number(query.perPage) || 10,
          sortBy: query.sortBy || 'name',
          sortOrder: query.sortOrder?.toUpperCase() || 'ASC',
        };
        const output = await this.listCurrencies.execute(input);
        return output;
      } catch (error: any) {
        console.error(error.message);
        throw error;
      }
    });
  }
}

export default ListCurrenciesController;
