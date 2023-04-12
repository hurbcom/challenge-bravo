import { Test, TestingModule } from '@nestjs/testing';
import {
    BadRequestException,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../src/libs/http-exception-filter';
import { CurrencyModule } from '../src/modules';
import { CreateFictitiumDtoStub, CurrencyStub } from './stubs';
import { getModelToken } from '@nestjs/mongoose';
import { Currency } from '../src/modules/currency/entities';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import * as npmVersion from '../package.json';

const mockConfigService = {
    get: jest.fn((Key: string, DefaultValue: string) => {
        switch (Key) {
            case 'url':
                return process.env.API_URL;
            case 'port':
                return process.env.API_PORT;
            case 'database':
                return {
                    host: process.env.DATABASE_HOST,
                    port: process.env.DATABASE_PORT,
                };
            case 'cryptoApi':
                return {
                    url: process.env.CRYPTO_API_URL,
                    token: process.env.CRYPTO_API_TOKEN,
                };
            case 'fiatApi':
                return {
                    url: process.env.FIAT_API_URL,
                    token: process.env.FIAT_API_TOKEN,
                };
            case 'supportCode':
                return process.env.SUPPORT_CODE;
            case 'refetchTimeInSeconds':
                process.env.REFETCH_TIME_IN_SECONDS;
                return;

            default:
                return DefaultValue;
        }
    }),
};

const mockCurrencyModel = {
    findOne: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockImplementation((code) => CurrencyStub(code)),
        }),
    }),
    updateMany: jest.fn().mockReturnValue({ modifiedCount: 1 }),
    create: jest
        .fn()
        .mockImplementation((currency) =>
            Promise.resolve(CurrencyStub(currency.code)),
        ),
};

describe('Currencyontroller (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [CurrencyModule, AppModule],
        })
            .overrideProvider(ConfigService)
            .useValue(mockConfigService)
            .overrideProvider(getModelToken(Currency.name))
            .useValue(mockCurrencyModel)

            .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );
        app.useGlobalFilters(new HttpExceptionFilter());

        await app.init();
    });

    it('/ (GET)', async () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({ version: npmVersion.version });
            });
    });

    it('/currencies (GET) - should calculate quotation between to currencies', async () => {
        return request(app.getHttpServer())
            .get('/currencies')
            .query({ from: 'USD', to: 'BRL', amount: '100' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(typeof response.body.result).toEqual('number');
            });
    });

    it('/currencies (GET) - should throw a erro because is missing required param', async () => {
        return request(app.getHttpServer())
            .get('/currencies')
            .query({ to: 'BRL', amount: '100' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400);
    });

    // it('/currencies (POST) - should create a new currency', async () => {
    //     return request(app.getHttpServer())
    //         .post('/currencies')
    //         .set(CreateFictitiumDtoStub())
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(201);
    // });

    it('/currencies (DELETE) - should disable a currency', async () => {
        return request(app.getHttpServer())
            .delete('/currencies/BRL')
            .expect(200);
    });
});
