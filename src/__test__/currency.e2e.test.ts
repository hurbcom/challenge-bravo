import request from "supertest";
import { type CurrencyRedisRepository } from "../Infra/Repository/Redis/CurrencyRedisRepository";
import injectContainer from "../invesity";
import app from "../Routes";

describe("GET /user", function () {
    let currencyRepository: CurrencyRedisRepository;
    beforeAll(async () => {
        currencyRepository =
            injectContainer.get<CurrencyRedisRepository>("CurrencyRepository");
        await currencyRepository.reset();
    });
    afterAll(async () => {
        await currencyRepository.close();
    });
    it("currency get conversion BRL to BTC", async function () {
        const data = await request(app)
            .get("/currency?from=BTC&to=BRL&amount=1")
            .set("Accept", "application/json")
            .expect(200);
        expect(data.body.total).toBeTruthy();
    });

    it("currency get conversion BRL to BTC", async function () {
        const data = await request(app)
            .get("/currency?to=BRL&amount=1")
            .set("Accept", "application/json")
            .expect(400);
        expect(data.body.message).toBe(
            'queries "from", "to" and "amount" is required'
        );
    });
});
