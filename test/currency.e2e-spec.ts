import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../src/currency/currency.entity';
import { AppModule } from '../src/app.module';
import { CurrencyDto } from '../src/currency/dto/currency.dto';
import { CurrencyService } from '../src/currency/currency.service';
import { ConfigService } from '../src/config/config.service';
import { CurrencyConversionService } from '../src/currency-conversion/currency.conversion.service';

describe('CurrencyController', () => {
    let app: INestApplication;
    let currencyService: CurrencyService;
    let configService: ConfigService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Currency]),
                AppModule,
            ],
        }).compile();

        app = module.createNestApplication();
        currencyService = app.get(CurrencyService);
        configService = app.get(ConfigService);
        await app.init();
    });

    afterEach(async () => {
        await currencyService.deleteAll();
    })

    describe('save()', () => {
        test('should return 403 when API_KEY is wrong', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', '')
                .expect(HttpStatus.FORBIDDEN);
        });

        test('should return 400 when currency code is less than 3 characters', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .send({
                    code: 'BR',
                    name: 'Real'
                })
                .expect(HttpStatus.BAD_REQUEST)
                .expect(response => {
                    expect(response.body.message).toContain('code size must be 3');
                });
        })

        test('should return 400 when currency code is higher than 3 characters', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .send({
                    code: 'BRSL',
                    name: 'Real'
                })
                .expect(HttpStatus.BAD_REQUEST).expect(response => {
                    expect(response.body.message).toContain('code size must be 3');
                });
        });

        test('should return 400 when currency code is already registered', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .send({
                    code: currencyCreated.code,
                    name: currencyCreated.name
                })
                .expect(HttpStatus.BAD_REQUEST).expect(async response => {
                    expect(response.body.message).toContain('code already exists');
                });
        });

        test('should return 400 when currency name is empty', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .send({
                    code: 'BRL',
                    name: ''
                })
                .expect(HttpStatus.BAD_REQUEST).expect(response => {
                    expect(response.body.message).toContain('name size must be between 1 and 255');
                });
        });

        test('should return 400 when currency name is higher than 255', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .send({
                    code: 'BRL',
                    name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                })
                .expect(HttpStatus.BAD_REQUEST).expect(response => {
                    expect(response.body.message).toContain('name size must be between 1 and 255');
                });
        });

        test('should return 400 when currency name is already registered', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .send({
                    code: 'BR2',
                    name: currencyCreated.name
                })
                .expect(HttpStatus.BAD_REQUEST).expect(async response => {
                    expect(response.body.message).toContain('name already exists');
                });
        });

        test('should return 400 when currency code is not registered in external exchange api', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .send({
                    code: 'WCR',
                    name: 'Wrong Currency'
                })
                .expect(HttpStatus.BAD_REQUEST).expect(response => {
                    expect(response.body.message).toContain('invalid code');
                });
        });

        test('should return 201 and save currency', async () => {
            const currencyDto: CurrencyDto = {
                code: 'BRL',
                name: 'Real'
            }

            return request(app.getHttpServer())
                .post('/currency')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .send(currencyDto)
                .expect(HttpStatus.CREATED)
                .expect(async response => {
                    const currencyCreated = await currencyService.findByCode(currencyDto.code);
                    expect(currencyCreated.code).toEqual(currencyDto.code);
                    expect(currencyCreated.name).toEqual(currencyDto.name);
                });
        });
    });

    describe('delete()', () => {
        test('should return 403 when API_KEY is wrong', () => {
            return request(app.getHttpServer())
                .delete('/currency/1')
                .set('API_KEY', '')
                .expect(HttpStatus.FORBIDDEN);
        });

        test('should return 404 when currency id does not exist', () => {
            return request(app.getHttpServer())
                .delete('/currency/1')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.NOT_FOUND);
        });

        test('should return 200 and currency must be deleted', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            return request(app.getHttpServer())
                .delete(`/currency/${currencyCreated.id}`)
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.OK);

        });
    });


    describe('convert()', () => {
        test('should return 403 when API_KEY is wrong', () => {
            return request(app.getHttpServer())
                .get('/currency/convert?codeFrom=x&codeTo=y&amount=0')
                .set('API_KEY', '')
                .expect(HttpStatus.FORBIDDEN);
        });

        test('should return 400 when amount is 0', () => {
            return request(app.getHttpServer())
                .get('/currency/convert?codeFrom=x&codeTo=y&amount=0')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.BAD_REQUEST)
                .expect(async response => {
                    expect(response.body.message).toContain('amount must be higher than zero');
                });
        });

        test('should return 400 when currency code from does not exist', () => {
            return request(app.getHttpServer())
                .get('/currency/convert?codeFrom=x&codeTo=y&amount=100')
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.BAD_REQUEST)
                .expect(async response => {
                    expect(response.body.message).toContain(`code x does not exist`);
                });
        });

        test('should return 400 when currency code to does not exist', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currencyCreated.code}&codeTo=y&amount=100`)
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.BAD_REQUEST)
                .expect(async response => {
                    expect(response.body.message).toContain(`code y does not exist`);

                });
        });

        test('should return 200 and convert EUR to USD', async () => {
            const amount = 100;

            const currencyFrom = await currencyService.save({
                name: 'Euro',
                code: 'EUR',
            });

            const currencyTo = await currencyService.save({
                name: 'Dolar',
                code: 'USD',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currencyFrom.code}&codeTo=${currencyTo.code}&amount=${amount}`)
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.OK)
                .expect(async response => {
                    const exchangeDto = await new CurrencyConversionService().quote(currencyFrom.code, currencyTo.code, amount);

                    expect(response.body.codeFrom).toBe(currencyFrom.code);
                    expect(response.body.codeTo).toBe(currencyTo.code);
                    expect(Number(response.body.amountFrom)).toBe(amount);
                    expect(response.body.amountTo).toBe(exchangeDto.amountTo);
                });
        });

        test('should return 200 and convert EUR to BRL', async () => {
            const amount = 100;

            const currencyFrom = await currencyService.save({
                name: 'Euro',
                code: 'EUR',
            });

            const currencyTo = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currencyFrom.code}&codeTo=${currencyTo.code}&amount=${amount}`)
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.OK)
                .expect(async response => {
                    const exchangeDto = await new CurrencyConversionService().quote(currencyFrom.code, currencyTo.code, amount);

                    expect(response.body.codeFrom).toBe(currencyFrom.code);
                    expect(response.body.codeTo).toBe(currencyTo.code);
                    expect(Number(response.body.amountFrom)).toBe(amount);
                    expect(response.body.amountTo).toBe(exchangeDto.amountTo);
                });
        });

        test('should return 200 and convert BRL to EUR', async () => {
            const amount = 100;

            const currencyFrom = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            const currencyTo = await currencyService.save({
                name: 'Euro',
                code: 'EUR',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currencyFrom.code}&codeTo=${currencyTo.code}&amount=${amount}`)
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.OK)
                .expect(async response => {
                    const exchangeDto = await new CurrencyConversionService().quote(currencyFrom.code, currencyTo.code, amount);

                    expect(response.body.codeFrom).toBe(currencyFrom.code);
                    expect(response.body.codeTo).toBe(currencyTo.code);
                    expect(Number(response.body.amountFrom)).toBe(amount);
                    expect(response.body.amountTo).toBe(exchangeDto.amountTo);
                });
        });

        test('should return 200 and convert BRL to BRL', async () => {
            const amount = 100;

            const currency = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currency.code}&codeTo=${currency.code}&amount=${amount}`)
                .set('API_KEY', configService.getEnvConfig().API_KEY)
                .expect(HttpStatus.OK)
                .expect(async response => {
                    const exchangeDto = await new CurrencyConversionService().quote(currency.code, currency.code, amount);

                    expect(response.body.codeFrom).toBe(currency.code);
                    expect(response.body.codeTo).toBe(currency.code);
                    expect(Number(response.body.amountFrom)).toBe(amount);
                    expect(Number(response.body.amountTo)).toBe(exchangeDto.amountTo);
                });
        });
    });
});