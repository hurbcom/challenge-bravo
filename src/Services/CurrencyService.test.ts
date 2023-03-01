import { Container } from "inversify";
import { type ICurrencyRepository } from "../Infra/Repository/types/CurrencyRepo.interface";
import { CurrencyService, type IExternalSourceType } from "./Currency";
import { CoincapRepositoryMock } from "./mocks/CoincapRepositoryMock";
import { CurrencyRepositoryMock } from "./mocks/CurrencyRepositoryMock";

describe("CurrencyService", () => {
    let currencyService: CurrencyService;
    let currencyRepository: ICurrencyRepository;
    let coincapRepository: IExternalSourceType;

    beforeAll(() => {
        const container = new Container();

        container
            .bind<CurrencyRepositoryMock>("CurrencyRepository")
            .to(CurrencyRepositoryMock)
            .inSingletonScope();

        container
            .bind<IExternalSourceType>("CoincapRepository")
            .to(CoincapRepositoryMock)
            .inSingletonScope();

        container.bind<CurrencyService>("CurrencyService").to(CurrencyService);

        currencyService = container.get<CurrencyService>("CurrencyService");
        coincapRepository =
            container.get<IExternalSourceType>("CoincapRepository");
        currencyRepository =
            container.get<ICurrencyRepository>("CurrencyRepository");
    });

    it("should make conversion (getConversion)", async () => {
        const value = await currencyService.getConversion("BRL", "EUR", 500);
        expect(value.total).toBe(90.8923510016775);
    });

    it("should return dollar rate for this currency (getDollarRate)", async () => {
        const getCurrencySpyOn = jest.spyOn(currencyRepository, "getCurrency");
        const getDollarRateSpyOn = jest.spyOn(
            currencyRepository,
            "getDollarRate"
        );
        const value = await currencyService.getDollarRate("BRL");
        expect(value).toBe(0.1928156874843337);
        expect(getCurrencySpyOn).toHaveBeenCalledTimes(1);
        expect(getDollarRateSpyOn).toHaveBeenCalledTimes(1);
    });

    it("should throw not found currency error (getDollarRate)", async () => {
        jest.spyOn(currencyRepository, "getCurrency").mockResolvedValue(null);

        await expect(currencyService.getDollarRate("BRL")).rejects.toThrow(
            "Not found currency"
        );
    });

    it("should throw not found DollarRate error (getDollarRate)", async () => {
        jest.spyOn(
            currencyService,
            "getDollarRateBySourceType"
        ).mockResolvedValue(undefined);

        await expect(currencyService.getDollarRate("BRL")).rejects.toThrow(
            "Not found dollar rate"
        );
    });

    it("should get fixed type(getDollarRateBySourceType)", async () => {
        const value = await currencyService.getDollarRateBySourceType({
            id: "TES",
            sourceType: "fixed",
            dollarRate: 0.9,
        });
        expect(value).toBe(0.9);
    });

    it("should get coincap type(getDollarRateBySourceType)", async () => {
        jest.spyOn(currencyRepository, "getDollarRate").mockResolvedValue(null);
        const value = await currencyService.getDollarRateBySourceType({
            id: "BRL",
            sourceType: "coincap",
        });
        expect(value).toBe(0.5);
    });

    it("should set cache when not found in redis repository(getDollarRateBySourceType)", async () => {
        jest.spyOn(currencyRepository, "getDollarRate").mockResolvedValue(null);
        const setDollarRateSpyOn = jest.spyOn(
            currencyRepository,
            "setDollarRate"
        );
        await currencyService.getDollarRateBySourceType({
            id: "BRL",
            sourceType: "coincap",
        });
        expect(setDollarRateSpyOn).toHaveBeenNthCalledWith(1, "BRL", 0.5);
    });

    it("should return null when not found(getDollarRateBySourceType)", async () => {
        jest.spyOn(currencyRepository, "getDollarRate").mockResolvedValue(null);
        jest.spyOn(
            coincapRepository,
            "getExternalDollarValue"
        ).mockResolvedValue(null);
        const setDollarRateSpyOn = jest.spyOn(
            currencyRepository,
            "setDollarRate"
        );
        const value = await currencyService.getDollarRateBySourceType({
            id: "BRL",
            sourceType: "coincap",
        });
        expect(setDollarRateSpyOn).toHaveBeenCalledTimes(0);
        expect(value).toBe(null);
    });
});
