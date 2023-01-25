import { CurrencyRepository } from "../../repositories/implementations/CurrencyRepository";
import { SeedDatabaseController } from "./SeedDatabaseController";
import { SeedDatabaseUseCase } from "./SeedDatabaseUseCase";

export default (): SeedDatabaseController => {
    const currencyRepository = new CurrencyRepository();
    const seedDatabaseUseCase = new SeedDatabaseUseCase(currencyRepository);

    const seedDatabaseController = new SeedDatabaseController(
        seedDatabaseUseCase
    );

    return seedDatabaseController;
};
