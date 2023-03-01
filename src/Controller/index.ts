import { ContainerModule, type interfaces } from "inversify";
import { CurrencyController } from "./CurrencyController";
import { ErrorController } from "./ErrorController";

const ControllerContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind("CurrencyController").to(CurrencyController);
    bind("ErrorController").to(ErrorController);
});

export { ControllerContainer };
