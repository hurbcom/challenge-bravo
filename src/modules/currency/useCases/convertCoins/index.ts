import { CurrencyRepository } from "../../repositories/implementations/CurrencyRepository";
import { ConvertCoinsController } from "./ConvertCoinsController";
import { ConvertCoinsUseCase } from "./ConvertCoinsUseCase";

export default (): ConvertCoinsController => {
    const currencyRepository = new CurrencyRepository();
    const convertCoinsUseCase = new ConvertCoinsUseCase(currencyRepository);

    const convertCoinsController = new ConvertCoinsController(
        convertCoinsUseCase
    );

    return convertCoinsController;
};
