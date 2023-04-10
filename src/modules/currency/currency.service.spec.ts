import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Currency, CurrencySchema } from './entities';
import { CurrencyController } from './currency.controller';
import { ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';

describe('CurrencyService', () => {
    let service: CurrencyService;
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

        service = app.get<CurrencyService>(CurrencyService);
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
        expect(service).toBeDefined();
    });
});
