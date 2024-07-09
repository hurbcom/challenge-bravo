import { errorHandler } from "./ErrorHandler";
import logger from "../helpers/Logger";
import type { Request, Response } from "express";

jest.mock("../helpers/Logger");

const mockRequest = (): Partial<Request> => ({});

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe("errorHandler", () => {
    it("should log the error and send a 500 response with the correct message", () => {
        const err = new Error("Test error");
        const req = mockRequest() as Request;
        const res = mockResponse() as Response;

        errorHandler(err, req, res);

        expect(logger.error).toHaveBeenCalledWith(err.stack);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: err.message,
        });
    });

    it("should log the error and send a 500 response with 'Internal Server Error' if no message is provided", () => {
        const err = new Error();
        const req = mockRequest() as Request;
        const res = mockResponse() as Response;

        errorHandler(err, req, res);

        expect(logger.error).toHaveBeenCalledWith(err.stack);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: "Internal Server Error",
        });
    });
});
