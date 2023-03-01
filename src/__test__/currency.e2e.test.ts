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

    it("should get 404 error when request a currency not registred", async function () {
        const data = await request(app)
            .get("/currency?from=WWW&to=BRL&amount=1")
            .set("Accept", "application/json")
            .expect(404);
        expect(data.body.message).toBe("Not found currency");
    });

    it("should get 500 error when get unknow error", async function () {
        jest.spyOn(currencyRepository, "getCurrency").mockImplementation(() => {
            throw new Error("internal-serve-error");
        });
        const data = await request(app)
            .get("/currency?from=BTC&to=BRL&amount=1")
            .set("Accept", "application/json")
            .expect(500);
        expect(data.body.message).toBe("internal server error");
    });

    it("should create a currency", async function () {
        await request(app)
            .post("/currency")
            .set("Accept", "application/json")
            .send({
                id: "HURB",
                sourceType: "fixed",
                dollarRate: 0.5,
            })
            .expect(201);

        const data = await request(app)
            .get("/currency?from=HURB&to=USD&amount=10")
            .set("Accept", "application/json")
            .expect(200);
        expect(data.body.total).toBe(5);
    });
});
