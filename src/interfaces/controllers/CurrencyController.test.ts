import type { Request, Response } from "express";
import { CurrencyController } from "./CurrencyController";
import type { CurrencyService } from "../../application/CurrencyService";
import { Currency } from "../../domain/Currency";
import type { CurrencyRepositoryDomain } from "../../domain/CurrencyRepository";

const mockCurrencyRepository: jest.Mocked<CurrencyRepositoryDomain> = {
    getExchangeRate: jest.fn(),
    addCurrency: jest.fn(),
    removeCurrency: jest.fn(),
    addExchangeRate: jest.fn(),
};

const mockCurrencyService = {
    currencyRepository: mockCurrencyRepository,
    convert: jest.fn(),
    addCurrency: jest.fn(),
    removeCurrency: jest.fn(),
    addExchangeRate: jest.fn(),
} as unknown as jest.Mocked<CurrencyService>;

const mockRequest = (body = {}, query = {}): Partial<Request> => ({
    body,
    query,
});

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("CurrencyController", () => {
    let controller: CurrencyController;

    beforeEach(() => {
        controller = new CurrencyController(mockCurrencyService);
        jest.clearAllMocks();
    });

    describe("addCurrency", () => {
        it("should call addCurrency with correct parameters", async () => {
            const req = mockRequest({ code: "USD" }) as Request;
            const res = mockResponse() as Response;

            await controller.addCurrency(req, res);

            expect(mockCurrencyService.addCurrency).toHaveBeenCalledWith(
                new Currency("USD")
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                statusCode: 201,
                content: "Created with success!",
            });
        });

        it("should handle errors", async () => {
            const req = mockRequest({ code: "USD" }) as Request;
            const res = mockResponse() as Response;
            const errorMessage = "Error adding currency";
            mockCurrencyService.addCurrency.mockRejectedValueOnce(
                new Error(errorMessage)
            );

            await controller.addCurrency(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
            });
        });
    });

    describe("removeCurrency", () => {
        it("should call removeCurrency with correct parameters and handle success", async () => {
            const req = mockRequest({ code: "USD" }) as Request;
            const res = mockResponse() as Response;
            mockCurrencyService.removeCurrency.mockResolvedValueOnce({
                deletedCount: 1,
            });

            await controller.removeCurrency(req, res);

            expect(mockCurrencyService.removeCurrency).toHaveBeenCalledWith(
                new Currency("USD")
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                statusCode: 200,
                content: "Currency code USD removed with success!",
            });
        });

        it("should handle errors", async () => {
            const req = mockRequest({ code: "USD" }) as Request;
            const res = mockResponse() as Response;
            const errorMessage = "Error removing currency";
            mockCurrencyService.removeCurrency.mockRejectedValueOnce(
                new Error(errorMessage)
            );

            await controller.removeCurrency(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
            });
        });

        it("should handle not found currency", async () => {
            const req = mockRequest({ code: "USD" }) as Request;
            const res = mockResponse() as Response;
            mockCurrencyService.removeCurrency.mockResolvedValueOnce({
                deletedCount: 0,
            });

            await controller.removeCurrency(req, res);

            expect(mockCurrencyService.removeCurrency).toHaveBeenCalledWith(
                new Currency("USD")
            );
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                statusCode: 400,
                content: "Currency code USD not found!",
            });
        });
    });

    describe("convert", () => {
        it("should call convert with correct parameters and handle success", async () => {
            const req = mockRequest(
                {},
                { from: "USD", to: "EUR", amount: "100" }
            ) as Request;
            const res = mockResponse() as Response;
            mockCurrencyService.convert.mockResolvedValueOnce(84);

            await controller.convert(req, res);

            expect(mockCurrencyService.convert).toHaveBeenCalledWith(
                { code: "USD" },
                { code: "EUR" },
                100
            );
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it("should handle errors", async () => {
            const req = mockRequest(
                {},
                { from: "USD", to: "EUR", amount: "100" }
            ) as Request;
            const res = mockResponse() as Response;
            const errorMessage = "Error converting currency";
            mockCurrencyService.convert.mockRejectedValueOnce(
                new Error(errorMessage)
            );

            await controller.convert(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
            });
        });
    });

    describe("addExchangeRate", () => {
        it("should call addExchangeRate with correct parameters", async () => {
            const req = mockRequest({
                from: "USD",
                to: "EUR",
                rate: 0.84,
            }) as Request;
            const res = mockResponse() as Response;

            await controller.addExchangeRate(req, res);

            expect(mockCurrencyService.addExchangeRate).toHaveBeenCalledWith(
                new Currency("USD"),
                new Currency("EUR"),
                0.84
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                statusCode: 201,
                content: "Created with success!",
            });
        });

        it("should handle errors", async () => {
            const req = mockRequest({
                from: "USD",
                to: "EUR",
                rate: 0.84,
            }) as Request;
            const res = mockResponse() as Response;
            const errorMessage = "Error adding exchange rate";
            mockCurrencyService.addExchangeRate.mockRejectedValueOnce(
                new Error(errorMessage)
            );

            await controller.addExchangeRate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
            });
        });
    });
});
