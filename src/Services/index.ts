import { ContainerModule, type interfaces } from "inversify";
import { CurrencyService, type ICurrencyService } from "./Currency";

const ServiceContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<ICurrencyService>("CurrencyService").to(CurrencyService);
});

export { ServiceContainer };
