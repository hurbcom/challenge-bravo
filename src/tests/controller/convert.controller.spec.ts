import { ConvertModule } from "@/modules/convert";
import { ConvertController } from "@/modules/convert/convert.controller";
import { Test, TestingModule } from "@nestjs/testing";

describe("ConvertController", () => {
    let controller: ConvertController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [ConvertModule],
        }).compile();

        controller = app.get<ConvertController>(ConvertController);
    });

    it("should convert currency to another currency", async () => {
        const result = await controller.convert({
            from: "BRL",
            to: "EUR",
            amount: 2,
        });
        expect(result).toStrictEqual({
            from: "BRL",
            to: "EUR",
            value: 0.36931,
        });
    });

    it("should return error when not exist currency (FROM)", async () => {
        const from = "XYW";
        await expect(
            controller.convert({
                from,
                to: "EUR",
                amount: 2,
            })
        ).rejects.toThrowError(`The currency ${from} not found`);
    });

    it("should return error when not exist currency (TO)", async () => {
        const to = "XYW";
        await expect(
            controller.convert({
                from: "EUR",
                to,
                amount: 2,
            })
        ).rejects.toThrowError(`The currency ${to} not found`);
    });
});
