import {
    CurrencyRepositoryMemory,
    CURRENCY_REPOSITORY,
} from "@/domain/repository";
import { CurrencyController } from "@/modules/currency/currency.controller";
import { CurrencyService } from "@/modules/currency/currency.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("CurrencyService", () => {
    let service: CurrencyService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [CurrencyController],
            providers: [
                {
                    provide: CURRENCY_REPOSITORY,
                    useClass: CurrencyRepositoryMemory,
                },
                CurrencyService,
            ],
        }).compile();

        service = app.get<CurrencyService>(CurrencyService);
    });

    it("should return all currencys", async () => {
        const result = await service.findAll();
        expect(result.length).toStrictEqual(5);
    });

    it("should be possible to create new currencys", async () => {
        const date = new Date();
        jest.useFakeTimers().setSystemTime(date);

        const result = await service.create({
            code: "ZYW",
            name: "Zud Yild W",
            value: 0.54312,
        });
        expect(result).toEqual({
            code: "ZYW",
            name: "Zud Yild W",
            value: 0.54312,
            createdAt: date,
            updatedAt: date,
        });
    });

    it("should be possible to delete any currency", async () => {
        await service.remove("BRL");

        const result = await service.findAll();
        expect(result.length).toStrictEqual(4);
    });

    it("should be possible to update any currency", async () => {
        const result = await service.update({ code: "BRL", value: 0.3 });
        const date = new Date();
        jest.useFakeTimers().setSystemTime(date);

        expect(result).toEqual({
            code: "BRL",
            name: "Real brasileiro",
            value: 0.3,
            createdAt: result.createdAt,
            updatedAt: date,
        });
    });

    it("should be possible to get any currency by code", async () => {
        const date = new Date();
        jest.useFakeTimers().setSystemTime(date);
        const result = await service.getByCode("BRL");

        expect(result).toEqual({
            code: "BRL",
            name: "Real brasileiro",
            value: 0.19444,
            createdAt: date,
            updatedAt: date,
        });
    });
});
