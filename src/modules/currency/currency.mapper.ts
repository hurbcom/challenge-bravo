import { format } from 'date-fns';
import { ResponseCurrencyDto } from './dto';
import { Currency } from './entities';

export class CurrencyMapper {
    static toDto(document: Currency): ResponseCurrencyDto {
        let dto: ResponseCurrencyDto = {
            code: document.code,
            name: document.name,
            exchangeRate: document.exchangeRate,
            type: document.type,
            lastUpdate: format(document.created, 'yyyy-MM-dd HH:mm:ss'),
        };

        return dto;
    }
}
