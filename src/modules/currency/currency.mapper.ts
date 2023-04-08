import { ResponseCurrencyDto } from './dto';
import { Currency } from './entities';

export class CurrencyMapper {
    static toDto(document: Currency): ResponseCurrencyDto {
        let dto: ResponseCurrencyDto = {
            code: document.code,
            name: document.name,
            rate: document.exchangeRate,
            type: document.type,
        };

        return dto;
    }
}
