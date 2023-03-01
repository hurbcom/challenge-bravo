import { ContainerModule, type interfaces } from "inversify";
import { CurrencyController } from "./CurrencyController";

const ControllerContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind("CurrencyController").to(CurrencyController);
});

export { ControllerContainer };
