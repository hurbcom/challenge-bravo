import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';

import {
    CreateFicticiusDto,
    ResponseCurrencyDto,
    ResponseQuotationDto,
} from './dto';
import { format } from 'date-fns';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Currency, CurrencyDocument } from './entities/currency.entity';
import { EnvironmentVariables } from 'src/config/configuration';
import { CurrencyMapper } from './currency.mapper';

@Injectable()
export class CurrencyService {
    constructor(
        @InjectModel(Currency.name)
        private currencyModel: Model<CurrencyDocument>,
        private readonly configService: ConfigService<EnvironmentVariables>,
        private readonly httpService: HttpService,
    ) {}

    /**
     * @description Calculates the quotation between two currencies using a backing currency
     * If the backing currency does not exist on the day, it will sync with the FIAt and Crypto APIs first
     *
     * @param {string} from - currency code used as the basis for calculating the quotation
     * @param {string} to - currency code used as target for calculating the quotation
     * @param {number} amount - value to convert between currencies
     * @returns {Promise<ResponseQuotationDto>}
     */
    async getQuotation(
        from: string,
        to: string,
        amount: number,
    ): Promise<ResponseQuotationDto> {
        const supportCode = this.configService.get('supportCode');

        // Check if the backing currency quote exists
        let currencyBacking = await this.findOneCurrency(supportCode);
        if (!currencyBacking) {
            await this.syncFiatQuotations(supportCode);
            await this.syncCryptoQuotations(supportCode);
        }

        // Find in mongodb the from currency
        const currencyFrom = await this.findOneCurrency(from);
        if (!currencyFrom)
            throw new BadRequestException(
                `The '${from}' currency code informed in the 'from' field is not supported.`,
            );

        // Find in mongodb the to currency
        const currencyTo = await this.findOneCurrency(to);
        if (!currencyTo)
            throw new BadRequestException(
                `The '${to}' currency code informed in the 'to' field is not supported.`,
            );

        const exchangeRate =
            Number(currencyTo.exchangeRate) / Number(currencyFrom.exchangeRate);

        return {
            info: {
                exchangeRate,
                lastUpdate: currencyFrom.created,
            },
            result: exchangeRate * amount,
        };
    }

    /**
     * @description Sync FIAT currencies with the external API
     *
     * @param {string} supportCode
     * @returns {Promise<void>}
     */
    async syncFiatQuotations(supportCode: string): Promise<void> {
        try {
            const currentDate = format(new Date(), 'yyyy-MM-dd');
            const fiatApi = this.configService.get('fiatApi');
            const fiatBaseUrl = `${fiatApi.url}/${fiatApi.token}`;

            const { data: lastQuotations } =
                await this.httpService.axiosRef.get(
                    `${fiatBaseUrl}/latest/${supportCode}`,
                );

            if (!lastQuotations?.conversion_rates)
                throw 'External api quotation failed';

            const { data: codes } = await this.httpService.axiosRef.get(
                `${fiatBaseUrl}/codes`,
            );

            if (!codes?.supported_codes) throw 'External api codes failed';

            const suportedCodes: Currency[] = codes.supported_codes.map(
                ([code, name]) => ({
                    code,
                    name,
                    exchangeRate: lastQuotations?.conversion_rates[code],
                    created: currentDate,
                    type: 'FIAT',
                    supportCode,
                }),
            );

            for (let suportedCode of suportedCodes) {
                suportedCode = await this.saveCurrency(suportedCode);
            }

            return;
        } catch (error) {
            throw new HttpException(
                error.message ?? error.response,
                HttpStatus.BAD_REQUEST,
                {
                    cause: error,
                },
            );
        }
    }

    /**
     * @description Sync Cryoto currencies with the external API
     *
     * @param {string} supportCode
     * @returns {Promise<void>}
     */
    async syncCryptoQuotations(supportCode: string): Promise<void> {
        try {
            const currentDate = format(new Date(), 'yyyy-MM-dd');
            const cryptoApi = this.configService.get('cryptoApi');

            const { data: lastQuotations } =
                await this.httpService.axiosRef.get(
                    `${cryptoApi.url}/live?access_key=${cryptoApi.token}`,
                );

            if (!lastQuotations?.success)
                throw 'Crypto external api quotation failed';

            const { data: codes } = await this.httpService.axiosRef.get(
                `${cryptoApi.url}/list?access_key=${cryptoApi.token}`,
            );

            if (!codes?.success) throw 'Crypto external api codes failed';

            const currencies: Currency[] = Object.values(codes.crypto).map(
                (value: { symbol: string; name: string }) => ({
                    code: value.symbol,
                    name: value.name,
                    exchangeRate: String(
                        1 / Number(lastQuotations?.rates[value.symbol]),
                    ),
                    created: currentDate,
                    type: 'CRYPTO',
                    supportCode,
                }),
            );

            for (let currency of currencies) {
                currency = await this.saveCurrency(currency);
            }

            return;
        } catch (error) {
            throw new HttpException(
                error.message ?? error.response,
                HttpStatus.BAD_REQUEST,
                {
                    cause: error,
                },
            );
        }
    }

    /**
     * @description Create a new currency in mongodb
     *
     * @param {Currency} data - Currency data to be saved
     * @returns {Promise<Currency>}
     */
    async saveCurrency(data: Currency): Promise<Currency> {
        const createdCoin = new this.currencyModel(data);
        return createdCoin.save();
    }

    /**
     * @description Query the last inserted currency in mongodb where:
     * Code equal to the search code;
     * Cannot have been deleted;
     * Creation date equal to today or type equal to fictional.
     *
     * @param {string} code - Currency code to search
     * @returns {Promise<Currency>}
     */
    async findOneCurrency(code: string): Promise<Currency> {
        return this.currencyModel
            .findOne({
                code,
                deleted: null,
                $or: [
                    { created: format(new Date(), 'yyy-MM-dd') },
                    { type: 'FICTICIUS' },
                ],
                supportCode: this.configService.get('supportCode'),
            })
            .sort({ $natural: -1 })
            .exec();
    }

    async reset(): Promise<void> {
        await this.currencyModel.deleteMany({});
    }

    async list(): Promise<ResponseCurrencyDto[]> {
        const aggregateCoins = await this.currencyModel.aggregate([
            {
                $group: {
                    _id: '$code',
                    lastRate: {
                        $last: '$$ROOT',
                    },
                },
            },
        ]);

        return aggregateCoins.map((aggregate) => {
            return CurrencyMapper.toDto(aggregate.lastRate);
        });
    }

    async createQuotation(ficticiusDto: CreateFicticiusDto) {
        const supportCode = this.configService.get('supportCode');

        let coin = await this.findOneCurrency(ficticiusDto.code);
        if (coin && coin.type !== 'FICTICIUS')
            throw new BadRequestException(
                `currency with code "${ficticiusDto.code}" cannot be created as it exists as FIAT or Crypto`,
            );

        if (ficticiusDto.quotation) {
            ficticiusDto.amount = ficticiusDto.quotation;
            ficticiusDto.baseAmount = 1;
        }

        const backing = await this.getQuotation(
            ficticiusDto.baseCode,
            supportCode, //backingCode
            1,
        );

        return this.saveCurrency({
            name: ficticiusDto.name,
            code: ficticiusDto.code,
            exchangeRate: String(
                ficticiusDto.amount /
                    (ficticiusDto.baseAmount * backing.result),
            ),
            supportCode,
            type: 'FICTICIUS',
            created: format(new Date(), 'yyyy-MM-dd'),
        });
    }

    async deleteCoin(code: string) {
        return this.currencyModel.updateMany(
            { code: code.toUpperCase(), deleted: null },
            { deleted: new Date() },
        );
    }
}
