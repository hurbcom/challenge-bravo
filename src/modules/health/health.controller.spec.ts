import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { CurrencyModule } from '../currency/currency.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigService } from '@nestjs/config';
import { Connection, connect } from 'mongoose';
import { Model } from 'mongoose';
import { Currency, CurrencySchema } from '../currency/entities';
import { HttpModule } from '@nestjs/axios';
import { CurrencyService } from '../currency/currency.service';
import { getModelToken } from '@nestjs/mongoose';

describe('HealthController', () => {
    let controller: HealthController;
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
            controllers: [HealthController],
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

        controller = app.get<HealthController>(HealthController);
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
        expect(controller).toBeDefined();
    });
});
