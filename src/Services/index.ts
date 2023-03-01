import { ContainerModule, type interfaces } from "inversify";
import { CurrencyService } from "./CurrencyService";
import { type ICurrencyService } from "./types/CurrencyService.interface";

const ServiceContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<ICurrencyService>("CurrencyService").to(CurrencyService);
});

export { ServiceContainer };
