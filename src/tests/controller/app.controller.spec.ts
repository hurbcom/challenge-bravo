import { AppController } from "@/app.controller";
import { AppModule } from "@/app.module";
import { Test, TestingModule } from "@nestjs/testing";

describe("AppController", () => {
    let appController: AppController;
    const data = new Date();

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe("root", () => {
        it("should return current datetime in ISO", () => {
            jest.useFakeTimers().setSystemTime(data);
            const expected = { timestamp: data.toISOString() };
            expect(appController.healthCheck()).toStrictEqual(expected);
        });
    });
});
