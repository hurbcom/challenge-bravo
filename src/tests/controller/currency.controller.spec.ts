import { CurrencyModule } from "@/modules/currency";
import { CurrencyController } from "@/modules/currency/currency.controller";
import { Test, TestingModule } from "@nestjs/testing";

describe("CurrencyController", () => {
    let controller: CurrencyController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [CurrencyModule],
        }).compile();

        controller = app.get<CurrencyController>(CurrencyController);
    });

    it("should return exception when passing value less or equal to zero", async () => {
        await expect(
            controller.create({
                code: "XYA",
                name: "New XYA",
                value: 0,
            })
        ).rejects.toThrowError("The value can't be negative or zero");
    });
});
