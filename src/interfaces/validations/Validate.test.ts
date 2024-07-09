import { z, type ZodSchema } from "zod";
import { validate } from "./Validate";
import type { Request, Response } from "express";

describe("Validate", () => {
    const mockRequest = (data = {}) => ({
        method: "GET",
        originalUrl: "/test",
        query: {},
        body: {},
        params: {},
        ...data,
    });

    const mockResponse = (): Partial<Response> => {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };

    describe("validate middleware", () => {
        let middleware: ReturnType<typeof validate>;
        let schema: ZodSchema;

        beforeEach(() => {
            schema = z.object({
                testParam: z.string(),
            });

            middleware = validate(schema);
        });

        it("should pass validation with correct data", () => {
            const req = mockRequest({ params: { testParam: "value" } });
            const res = mockResponse();
            const next = jest.fn();

            middleware(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
        });

        it("should handle query parameters", () => {
            const req = mockRequest({ query: { testParam: "value" } });
            const res = mockResponse();
            const next = jest.fn();

            middleware(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
        });

        it("should handle body parameters", () => {
            const req = mockRequest({ body: { testParam: "value" } });
            const res = mockResponse();
            const next = jest.fn();

            middleware(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
