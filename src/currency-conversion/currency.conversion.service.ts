import axios from 'axios';
import { CurrencyConversionDto } from './dto/currency.conversion.dto';

// we consume from https://economia.awesomeapi.com.br to convert currencies

export class CurrencyConversionService {

    private readonly baseCurrency: string = 'BRL';
    private readonly url: string = 'https://economia.awesomeapi.com.br';

    // our base currency is BRL

    getBaseCurrency(): string {
        return this.baseCurrency;
    }

    /* we integrate with the external api to find out how much 1 real 
    is worth against the currency as a parameter 
    example: 1 BRL is 0.25 USD (if 1 BRL were 4 USD)
    response: fromCode BRL fromAmount 1.00 toCode USD toAmount 0.25  */

    private async baseQuote(code: string): Promise<CurrencyConversionDto> {
        const data = await axios.get(`${this.url}/${code}-${this.baseCurrency}/1`).then(response => {
            return response.data;
        });

        if (data.length > 0) {
            return {
                codeFrom: data[0].codein,
                codeTo: data[0].code,
                amountFrom: 1,
                amountTo: data[0].ask
            };
        } else {
            return null;
        }
    }

    // if code exists in external api

    async isValidCode(code: string): Promise<boolean> {
        return await this.baseQuote(code) !== null;
    }

    // logic to quote between two currencies

    async quote(codeFrom: string, codeTo: string, amount: number): Promise<CurrencyConversionDto> {
        const dto = new CurrencyConversionDto();
        dto.codeFrom = codeFrom;
        dto.codeTo = codeTo;
        dto.amountFrom = amount;

        if (codeFrom === codeTo) {
            dto.amountTo = amount;
        } else if (codeFrom === this.getBaseCurrency()) {
            const quote = await this.baseQuote(codeTo);
            dto.amountTo = amount / quote.amountTo;
        } else if (codeTo === this.getBaseCurrency()) {
            const quote = await this.baseQuote(codeFrom);
            dto.amountTo = amount * quote.amountTo;
        } else {
            const firstQuote = await this.baseQuote(codeFrom);
            const secondQuote = await this.baseQuote(codeTo);
            dto.amountTo = amount / firstQuote.amountTo * secondQuote.amountTo;
        }

        return dto;
    }

}