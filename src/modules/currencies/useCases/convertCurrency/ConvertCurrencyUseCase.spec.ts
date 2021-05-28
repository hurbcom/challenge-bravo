import { AppError } from "../../../../shared/errors/AppError";
import { IExchangeApiService } from "../../../../shared/services/IExchangeApiService";
import { getTodayDate } from "../../../../shared/utils/dateOperation";
import { makeExchangeApiService } from "../../../../shared/utils/tests/makeExchangeApiServiceStub";
import { ICreateCurrencyDTO } from "../../dtos/ICreateCurrencyDTO";
import { CurrenciesRepositoryInMemory } from "../../repositories/in-memory/CurrenciesRepositoryInMemory";
import {
  ConvertCurrencyUseCase,
  IConvertCurrencyRequest,
} from "./ConvertCurrencyUseCase";

let convertCurrencyUseCase: ConvertCurrencyUseCase;
let currenciesRepositoryInMemory: CurrenciesRepositoryInMemory;
let exchangeApiServiceStub: IExchangeApiService;

let fromCurrencyDTO: ICreateCurrencyDTO;
let toCurrencyDTO: ICreateCurrencyDTO;
let convertCurrencyRequest: IConvertCurrencyRequest;

describe("Create currency", () => {
  beforeEach(() => {
    exchangeApiServiceStub = makeExchangeApiService();
    currenciesRepositoryInMemory = new CurrenciesRepositoryInMemory();
    convertCurrencyUseCase = new ConvertCurrencyUseCase(
      currenciesRepositoryInMemory,
      exchangeApiServiceStub
    );

    fromCurrencyDTO = {
      currencyCode: "FROM CRC",
      currencyName: "From Currency",
      isFictional: false,
      priceUsd: 5,
    };

    toCurrencyDTO = {
      currencyCode: "TO CRC",
      currencyName: "To Currency",
      isFictional: false,
      priceUsd: 5,
    };

    convertCurrencyRequest = {
      from: fromCurrencyDTO.currencyCode,
      to: toCurrencyDTO.currencyCode,
      amount: 100,
    };
  });

  it("should be able to convert", async () => {
    const fromCurrency = await currenciesRepositoryInMemory.addCurrency(
      fromCurrencyDTO
    );
    const toCurrency = await currenciesRepositoryInMemory.addCurrency(
      toCurrencyDTO
    );

    const convertResult = await convertCurrencyUseCase.execute(
      convertCurrencyRequest
    );

    const value =
      (fromCurrency.priceUsd / toCurrency.priceUsd) *
      convertCurrencyRequest.amount;

    expect(convertResult.value).toBe(value);
  });

  it("should not be able to convert if the from currency is not registered", async () => {
    await currenciesRepositoryInMemory.addCurrency(toCurrencyDTO);

    await expect(async () => {
      await convertCurrencyUseCase.execute(convertCurrencyRequest);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to convert if the to currency is not registered", async () => {
    await currenciesRepositoryInMemory.addCurrency(fromCurrencyDTO);

    await expect(async () => {
      await convertCurrencyUseCase.execute(convertCurrencyRequest);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("the currency price should be updated if expired", async () => {
    const fromCurrency = await currenciesRepositoryInMemory.addCurrency(
      fromCurrencyDTO
    );

    await currenciesRepositoryInMemory.addCurrency(toCurrencyDTO);

    jest
      .spyOn(currenciesRepositoryInMemory, "getCurrencyByCode")
      .mockReturnValueOnce(
        new Promise((resolve, reject) =>
          resolve(Object.assign(fromCurrency, { expireAt: getTodayDate() }))
        )
      );

    const getCurrencySpyOn = jest.spyOn(exchangeApiServiceStub, "getCurrency");

    await convertCurrencyUseCase.execute(convertCurrencyRequest);

    expect(getCurrencySpyOn).toBeCalledTimes(1);
  });

  it("the currency price should not be updated if expire date were null", async () => {
    const fromCurrency = await currenciesRepositoryInMemory.addCurrency(
      fromCurrencyDTO
    );

    const toCurrency = await currenciesRepositoryInMemory.addCurrency(
      toCurrencyDTO
    );

    jest
      .spyOn(currenciesRepositoryInMemory, "getCurrencyByCode")
      .mockReturnValueOnce(
        new Promise((resolve, reject) =>
          resolve(Object.assign(fromCurrency, { expireAt: null }))
        )
      );

    jest
      .spyOn(currenciesRepositoryInMemory, "getCurrencyByCode")
      .mockReturnValueOnce(
        new Promise((resolve, reject) =>
          resolve(Object.assign(toCurrency, { expireAt: null }))
        )
      );

    const getCurrencySpyOn = jest.spyOn(exchangeApiServiceStub, "getCurrency");

    await convertCurrencyUseCase.execute(convertCurrencyRequest);

    expect(getCurrencySpyOn).toBeCalledTimes(0);
  });
});
