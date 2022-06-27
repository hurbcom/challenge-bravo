import request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { CurrencyModule } from "@/modules/currency";
import { CurrencyService } from "@/modules/currency/currency.service";
import { currencyMock } from "../mocks/currency.mock";
import { CreateCurrencyExchange, CurrencyExchange } from "@/domain/entity";
import { UpdateCurrencyDto } from "@/modules/currency/currency.dto";
import {
    CurrencyRepositoryMemory,
    CURRENCY_REPOSITORY,
} from "@/domain/repository";

describe("Cats", () => {
    let app: INestApplication;
    let currencys = [currencyMock(), currencyMock(), currencyMock()];
    const currencyService = {
        findAll() {
            return currencys;
        },
        getByCode(code: string): CurrencyExchange {
            return currencys.find(
                (currency) => currency.code === code.toUpperCase()
            );
        },
        create(currency: CreateCurrencyExchange) {
            const currencyExchange = new CurrencyExchange(currency);
            currencys.push(currencyExchange);
            return currencyExchange;
        },
        update({ code, value }: UpdateCurrencyDto) {
            const currency = this.getByCode(code);
            currency.updateValue(value);
            return currency;
        },
        remove(code: string) {
            currencys = currencys.filter((currency) => currency.code !== code);
        },
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CurrencyModule],
            providers: [
                {
                    provide: CURRENCY_REPOSITORY,
                    useClass: CurrencyRepositoryMemory,
                },
            ],
        })
            .overrideProvider(CurrencyService)
            .useValue(currencyService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/GET currency`, () => {
        return request(app.getHttpServer())
            .get("/currency")
            .expect(200)
            .expect((res) => {
                res.body === currencys;
            });
    });

    it(`/POST currency`, () => {
        const input = {
            code: "XYz",
            name: "XYZ Fantasy",
            value: 10,
        };

        return request(app.getHttpServer())
            .post("/currency")
            .send(input)
            .expect(201)
            .expect((res) => {
                res.body === new CurrencyExchange(input);
            });
    });

    it(`/PATCH currency`, () => {
        const input = {
            code: currencys[0].code,
            value: 10,
        };

        const expected = { ...currencys[0], code: 10 };

        return request(app.getHttpServer())
            .patch("/currency")
            .send(input)
            .expect(200)
            .expect((res) => {
                res.body === expected;
            });
    });

    it(`/GET currency by CODE`, () => {
        const currency = currencys[1];
        const { code } = currency;

        return request(app.getHttpServer())
            .get(`/currency/${code}`)
            .expect(200)
            .expect((res) => {
                res.body === currency;
            });
    });

    it(`/DELETE currency`, () => {
        const currency = currencys[1];
        const { code } = currency;

        return request(app.getHttpServer())
            .delete(`/currency/${code}`)
            .expect(204);
    });

    afterAll(async () => {
        await app.close();
    });
});
