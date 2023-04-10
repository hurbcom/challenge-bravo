import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { Currency, CurrencySchema } from './entities/currency.entity';
import { getModelToken } from '@nestjs/mongoose';
import { ResponseCurrencyDtoStub } from 'test/stubs/response-currency.dto.stub';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('CurrencyController', () => {
    let currencyController: CurrencyController;
    let config: ConfigService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let currencyModel: Model<Currency>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        currencyModel = mongoConnection.model(Currency.name, CurrencySchema);
        const app: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            controllers: [CurrencyController],
            providers: [
                CurrencyService,
                {
                    provide: getModelToken(Currency.name),
                    useValue: currencyModel,
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((Key: string, DefaultValue: string) => {
                            switch (Key) {
                                case 'FILES':
                                    return './fakedata/';
                                    break;
                                case 'PORT':
                                    return '9999';
                                    break;
                                default:
                                    return DefaultValue;
                            }
                        }),
                    },
                },
            ],
        }).compile();

        currencyController = app.get<CurrencyController>(CurrencyController);
        config = app.get<ConfigService>(ConfigService);
    });

    afterAll(async () => {
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });

    afterEach(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    it('should be defined', () => {
        expect(currencyController).toBeDefined();
    });
});
