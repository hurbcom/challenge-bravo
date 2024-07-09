import {
    convertSchema,
    addCurrencySchema,
    addCurrencyRequestSchema,
    removeCurrencySchema,
    removeCurrencyRequestSchema,
    addExchangeRateSchema,
    addExchangeRateRequestSchema,
    resultResponseSchema,
    healthResponseSchema,
} from "./Schemas";

describe("Schemas", () => {
    describe("convertSchema", () => {
        it("Should pass with correct data", () => {
            const data = {
                from: "USD",
                to: "BRL",
                amount: "123.45",
            };

            expect(convertSchema.safeParse(data).success).toBe(true);
        });

        it("'from' is invalid", () => {
            const invalidData = { from: "", to: "BRL", amount: "123.45" };

            const result = convertSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("from");
        });

        it("'to' is invalid", () => {
            const invalidData = { from: "USD", to: "", amount: "123.45" };

            const result = convertSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("to");
        });

        it("'amount' is not number", () => {
            const invalidData = { from: "USD", to: "BRL", amount: "abc" };
            const result = convertSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "Amount must be a number"
            );
            expect(result.error?.errors[0].path[0]).toBe("amount");
        });
    });

    describe("addCurrencySchema", () => {
        it("Should pass with correct data", () => {
            const data = { code: "EUR" };

            expect(addCurrencySchema.safeParse(data).success).toBe(true);
        });

        it("'code' is empty", () => {
            const invalidData = { code: "" };
            const result = addCurrencySchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("code");
        });
    });

    describe("addCurrencyRequestSchema", () => {
        it("Should pass with correct data", () => {
            const data = { body: { code: "EUR" } };

            expect(addCurrencyRequestSchema.safeParse(data).success).toBe(true);
        });

        it("'code' is empty", () => {
            const invalidData = { body: { code: "" } };
            const result = addCurrencyRequestSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("body");
            expect(result.error?.errors[0].path[1]).toBe("code");
        });
    });

    describe("removeCurrencySchema", () => {
        it("Should pass with correct data", () => {
            const data = { code: "EUR" };

            expect(removeCurrencySchema.safeParse(data).success).toBe(true);
        });

        it("'code' is empty", () => {
            const invalidData = { code: "" };
            const result = removeCurrencySchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("code");
        });
    });

    describe("removeCurrencyRequestSchema", () => {
        it("Should pass with correct data", () => {
            const data = { body: { code: "EUR" } };

            expect(removeCurrencyRequestSchema.safeParse(data).success).toBe(
                true
            );
        });

        it("'code' is empty", () => {
            const invalidData = { body: { code: "" } };
            const result = removeCurrencyRequestSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("body");
            expect(result.error?.errors[0].path[1]).toBe("code");
        });
    });

    describe("addExchangeRateSchema", () => {
        it("Should pass with correct data", () => {
            const data = { from: "USD", to: "EUR", rate: 1.2 };

            expect(addExchangeRateSchema.safeParse(data).success).toBe(true);
        });

        it("'from' is empty", () => {
            const invalidData = { from: "", to: "EUR", rate: 1.2 };
            const result = addExchangeRateSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("from");
        });

        it("'to' is empty", () => {
            const invalidData = { from: "USD", to: "", rate: 1.2 };
            const result = addExchangeRateSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("to");
        });

        it("'rate' is negative", () => {
            const invalidData = { from: "USD", to: "EUR", rate: -1.2 };
            const result = addExchangeRateSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "Number must be greater than or equal to 0"
            );
            expect(result.error?.errors[0].path[0]).toBe("rate");
        });
    });

    describe("addExchangeRateRequestSchema", () => {
        it("Should pass with correct data", () => {
            const data = { body: { from: "USD", to: "EUR", rate: 1.2 } };

            expect(addExchangeRateRequestSchema.safeParse(data).success).toBe(
                true
            );
        });

        it("'from' is empty", () => {
            const invalidData = { body: { from: "", to: "EUR", rate: 1.2 } };
            const result = addExchangeRateRequestSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("body");
            expect(result.error?.errors[0].path[1]).toBe("from");
        });

        it("'to' is empty", () => {
            const invalidData = { body: { from: "USD", to: "", rate: 1.2 } };
            const result = addExchangeRateRequestSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "String must contain at least 1 character(s)"
            );
            expect(result.error?.errors[0].path[0]).toBe("body");
            expect(result.error?.errors[0].path[1]).toBe("to");
        });

        it("'rate' is negative", () => {
            const invalidData = {
                body: { from: "USD", to: "EUR", rate: -1.2 },
            };
            const result = addExchangeRateRequestSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "Number must be greater than or equal to 0"
            );
            expect(result.error?.errors[0].path[0]).toBe("body");
            expect(result.error?.errors[0].path[1]).toBe("rate");
        });
    });

    describe("resultResponseSchema", () => {
        it("Should pass with correct data", () => {
            const data = { statusCode: 200, content: "Some data" };

            expect(resultResponseSchema.safeParse(data).success).toBe(true);
        });

        it("'statusCode' is invalid", () => {
            const invalidData = { statusCode: "200", content: "Some data" };
            const result = resultResponseSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "Expected number, received string"
            );
            expect(result.error?.errors[0].path[0]).toBe("statusCode");
        });
    });

    describe("healthResponseSchema", () => {
        it("Should pass with correct data", () => {
            const data = { status: "ok" };

            expect(healthResponseSchema.safeParse(data).success).toBe(true);
        });

        it("'status' is invalid", () => {
            const invalidData = { status: 200 };
            const result = healthResponseSchema.safeParse(invalidData);
            expect(result.error?.errors[0].message).toBe(
                "Expected string, received number"
            );
            expect(result.error?.errors[0].path[0]).toBe("status");
        });
    });
});
