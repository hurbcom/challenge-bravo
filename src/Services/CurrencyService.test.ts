import { Container } from "inversify";
import { type ICurrencyRepository } from "../Infra/Repository/types/CurrencyRepo.interface";
import { type IExternalSourceType } from "../Infra/Repository/types/ExternalSourceType.interface";
import { CurrencyService } from "./CurrencyService";
import { CoingateRepositoryMock } from "./mocks/CoingateRepositoryMock";
import { CurrencyRepositoryMock } from "./mocks/CurrencyRepositoryMock";

describe("CurrencyService", () => {
    let currencyService: CurrencyService;
    let currencyRepository: ICurrencyRepository;
    let coingateRepository: IExternalSourceType;

    beforeAll(() => {
        const container = new Container();

        container
            .bind<CurrencyRepositoryMock>("CurrencyRepository")
            .to(CurrencyRepositoryMock)
            .inSingletonScope();

        container
            .bind<IExternalSourceType>("CoingateRepository")
            .to(CoingateRepositoryMock)
            .inSingletonScope();

        container.bind<CurrencyService>("CurrencyService").to(CurrencyService);

        currencyService = container.get<CurrencyService>("CurrencyService");
        coingateRepository =
            container.get<IExternalSourceType>("CoingateRepository");
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

    it("should get coingate type(getDollarRateBySourceType)", async () => {
        jest.spyOn(currencyRepository, "getDollarRate").mockResolvedValue(null);
        const value = await currencyService.getDollarRateBySourceType({
            id: "BRL",
            sourceType: "coingate",
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
            sourceType: "coingate",
        });
        expect(setDollarRateSpyOn).toHaveBeenNthCalledWith(1, "BRL", 0.5);
    });

    it("should return null when not found(getDollarRateBySourceType)", async () => {
        jest.spyOn(currencyRepository, "getDollarRate").mockResolvedValue(null);
        jest.spyOn(
            coingateRepository,
            "getExternalDollarValue"
        ).mockResolvedValue(null);
        const setDollarRateSpyOn = jest.spyOn(
            currencyRepository,
            "setDollarRate"
        );
        const value = await currencyService.getDollarRateBySourceType({
            id: "BRL",
            sourceType: "coingate",
        });
        expect(setDollarRateSpyOn).toHaveBeenCalledTimes(0);
        expect(value).toBe(null);
    });

    it("should get all currencies cache (getAllCurrenciesDollarRateCache)", async () => {
        const getAllCurrenciesSpyOn = jest.spyOn(
            currencyRepository,
            "getAllCurrencies"
        );
        const getDollarRateSpyOn = jest
            .spyOn(currencyRepository, "getDollarRate")
            .mockResolvedValue(null);
        const setDollarRateSpyOn = jest.spyOn(
            currencyRepository,
            "setDollarRate"
        );

        await currencyService.getAllCurrenciesDollarRateCache();

        expect(getAllCurrenciesSpyOn).toHaveBeenCalledTimes(1);
        expect(getDollarRateSpyOn).toHaveBeenCalledTimes(3);
        expect(setDollarRateSpyOn).toHaveBeenCalledTimes(3);
    });

    it("should create a currency(createCurrency)", async () => {
        const setCurrencySpyOn = jest.spyOn(currencyRepository, "setCurrency");
        await currencyService.createCurrency({
            id: "TES",
            sourceType: "fixed",
            dollarRate: 0.9,
        });
        expect(setCurrencySpyOn).toHaveBeenCalledTimes(1);
    });

    it("should not create a currency when not valid(createCurrency)", async () => {
        const setCurrencySpyOn = jest.spyOn(currencyRepository, "setCurrency");
        await expect(
            currencyService.createCurrency({
                id: "TES",
                sourceType: "test",
                dollarRate: 0.9,
            })
        ).rejects.toThrow(
            "sourceType must be one of the following values: fixed, coingate"
        );
        expect(setCurrencySpyOn).toHaveBeenCalledTimes(0);
    });

    it("should delete a currency(deleteCurrency)", async () => {
        const deleteCurrencySpyOn = jest.spyOn(
            currencyRepository,
            "deleteCurrency"
        );
        await currencyService.deleteCurrency("TES");
        expect(deleteCurrencySpyOn).toHaveBeenCalledTimes(1);
    });
});
