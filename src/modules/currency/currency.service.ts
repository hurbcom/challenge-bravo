import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';

import {
    CreateFictitiumDto,
    ResponseCurrencyDto,
    ResponseQuotationDto,
} from './dto';
import { format, subSeconds } from 'date-fns';
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
    private readonly logger = new Logger(CurrencyService.name);

    /**
     * @description Calculates the quotation between two currencies using a backing currency
     * If the backing currency does not exist on the day, it will sync with the FIAt and Crypto APIs first
     *
     * @param {string} from - currency code used as the basis for calculating the quotation
     * @param {string} to - currency code used as target for calculating the quotation
     * @param {number} amount - value to convert between currencies
     * @returns {Promise<ResponseQuotationDto>}
     */
    async quotation(
        from: string,
        to: string,
        amount: number,
    ): Promise<ResponseQuotationDto> {
        const supportCode = this.configService.get('supportCode');

        // Check if the backing currency quote exists
        let currencyBacking = await this.findOne(supportCode);
        if (!currencyBacking) {
            await this.syncFiatQuotations(supportCode);
            await this.syncCryptoQuotations(supportCode);
        }

        // Find in mongodb the from currency
        const currencyFrom = await this.findOne(from);
        if (!currencyFrom)
            throw new BadRequestException(
                `The '${from}' currency code informed in the 'from' field is not supported.`,
            );

        // Find in mongodb the to currency
        const currencyTo = await this.findOne(to);
        if (!currencyTo)
            throw new BadRequestException(
                `The '${to}' currency code informed in the 'to' field is not supported.`,
            );

        const exchangeRate =
            Number(currencyTo.exchangeRate) / Number(currencyFrom.exchangeRate);

        return {
            info: {
                exchangeRate,
                lastUpdate: format(new Date(), 'yyy-MM-dd HH:mm:ss'),
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
                    created: new Date(),
                    type: 'FIAT',
                    supportCode,
                }),
            );

            for (let suportedCode of suportedCodes) {
                suportedCode = await this.saveCurrency(suportedCode);
            }

            this.logger.debug('Sync FIAT');
            return;
        } catch (error) {
            throw new HttpException(
                error.message ?? error.response,
                HttpStatus.BAD_REQUEST,
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
            const cryptoApi = this.configService.get('cryptoApi');

            const { data: lastQuotations } =
                await this.httpService.axiosRef.get(
                    `${cryptoApi.url}/live?access_key=${cryptoApi.token}`,
                );

            if (!lastQuotations?.success)
                throw (
                    lastQuotations?.error?.info ??
                    'Crypto external api quotation failed'
                );

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
                    created: new Date(),
                    type: 'CRYPTO',
                    supportCode,
                }),
            );

            for (let currency of currencies) {
                currency = await this.saveCurrency(currency);
            }

            this.logger.debug('Sync CRYPTO');
            return;
        } catch (error) {
            throw new HttpException(
                error.message ?? error.response,
                HttpStatus.BAD_REQUEST,
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
        const createdCoin = await this.currencyModel.create(data);
        return createdCoin;
    }

    /**
     * @description Query the last inserted currency in mongodb where:
     * Code equal to the search code;
     * Cannot have been deleted;
     * Creation date equal to today or type equal to fictional;
     * supportCode is equal to defined in environment.
     *
     * @param {string} code - Currency code to search
     * @returns {Promise<Currency>}
     */
    async findOne(code: string): Promise<Currency> {
        return this.currencyModel
            .findOne({
                code,
                deleted: null,
                $or: [
                    {
                        created: {
                            $gte: subSeconds(
                                new Date(),
                                this.configService.get('refetchTimeInSeconds'),
                            ),
                        },
                    },
                    { type: 'FICTITIUM' },
                ],
                supportCode: this.configService.get('supportCode'),
            })
            .sort({ $natural: -1 })
            .exec();
    }

    // async reset(): Promise<void> {
    //     await this.currencyModel.deleteMany({});
    // }

    async list(): Promise<ResponseCurrencyDto[]> {
        const aggregateCoins = await this.currencyModel.aggregate([
            { $match: { deleted: null } },
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

    async create(
        fictitiumDto: CreateFictitiumDto,
    ): Promise<ResponseCurrencyDto> {
        const supportCode = this.configService.get('supportCode');

        console.log(fictitiumDto);

        let coin = await this.findOne(fictitiumDto.code);
        if (coin && coin.type !== 'FICTITIUM')
            throw new BadRequestException(
                `currency with code "${fictitiumDto.code}" cannot be created as it exists as FIAT or Crypto`,
            );

        if (fictitiumDto.quotation) {
            fictitiumDto.amount = fictitiumDto.quotation;
            fictitiumDto.baseAmount = 1;
        }

        console.log(supportCode);

        const backing = await this.quotation(
            fictitiumDto.baseCode,
            supportCode, //backingCode
            1,
        );

        const createdCurrency = await this.saveCurrency({
            name: fictitiumDto.name,
            code: fictitiumDto.code,
            exchangeRate: String(
                fictitiumDto.amount /
                    (fictitiumDto.baseAmount * backing.result),
            ),
            supportCode,
            type: 'FICTITIUM',
            created: new Date(),
        });

        return CurrencyMapper.toDto(createdCurrency);
    }

    async disable(code: string): Promise<void> {
        const updateResponse = await this.currencyModel.updateMany(
            { code: code.toUpperCase(), deleted: null },
            { deleted: new Date() },
        );

        if (!updateResponse.modifiedCount) {
            throw new BadRequestException(
                `No active currency found for code ${code}`,
            );
        }

        return;
    }
}
