import { ConvertCurrency } from '@/application/use-case';
import { HttpServer } from '@/infra/http-server';

export class ConvertCurrencyController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly convertCurrency: ConvertCurrency
  ) {
    this.httpServer.register(
      'get',
      '/currencies/convert',
      async ({ query }) => {
        const input = {
          from: query.from.toUpperCase(),
          to: query.to.toUpperCase(),
          amount: Number(query.amount),
        };
        const output = await this.convertCurrency.execute(input);
        return {
          from: input.from,
          to: input.to,
          givenAmount: input.amount,
          convertedAmount: output.value,
          decimalPoints: output.decimalPoints,
          symbol: output.symbol,
          convertedAmountFormatted: `${output.symbol} ${output.value.toFixed(output.decimalPoints)}`,
        };
      }
    );
  }
}

export default ConvertCurrencyController;
