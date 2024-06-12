import ConvertCurrency from "@/application/use-case/convert-currency";
import CreateCurrencyRate, { CreateCurrencyRateDto } from "@/application/use-case/create-currency-rate";
import { DeleteCurrencyRateByCode } from "@/application/use-case/delete-currency-rate-by-code";
import GetCurrencyRateByCode from "@/application/use-case/get-currency-rate-by-code";
import { HttpServer } from "@/infra/http-server/http-server";

export class CurrencyController {
  constructor(
    readonly httpServer: HttpServer,
    readonly convertCurrency: ConvertCurrency,
    readonly createCurrencyRate: CreateCurrencyRate,
    readonly getCurrencyRateByCode: GetCurrencyRateByCode,
    readonly deleteCurrencyRateByCode: DeleteCurrencyRateByCode
  ) {

    httpServer.register('get', '/currencies/convert', async ({ query }) => {
      const input = {
        from: query.from.toUpperCase(),
        to: query.to.toUpperCase(),
        amount: Number(query.amount)
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
      }
    })

    httpServer.register('post', '/currencies', async ({ body }) => {
      try {
        const input: CreateCurrencyRateDto = {
          name: body.name,
          code: body.code,
          symbol: body.symbol,
          decimalPoints: body.decimalPoints,
          baseAmount: body.baseAmount,
          equivalentCurrencyAmount: body.equivalentCurrencyAmount,
          equivalentCurrencyCode: body.equivalentCurrencyCode
        }
        const output = await this.createCurrencyRate.execute(input);
        return output
      } catch (error: any) {
        console.error(error.message)
        throw error
      }
    })
    httpServer.register('get', '/currencies/{code}', async ({ params }) => {
      const { code } = params;
      const output = await this.getCurrencyRateByCode.execute(code);
      return output
    })
    httpServer.register('delete', '/currencies/{code}', async ({ params }) => {
      const { code } = params;
      await this.deleteCurrencyRateByCode.execute(code);
      return { message: 'Currency deleted' }
    })
  }

}