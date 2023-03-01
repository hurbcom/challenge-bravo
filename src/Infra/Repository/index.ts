import { ContainerModule, type interfaces } from "inversify";
import { CoingateRepository } from "./Coingate/CoingateRepository";
import { CurrencyRedisRepository } from "./Redis/CurrencyRedisRepository";
import { type ICurrencyRepository } from "./types/CurrencyRepo.interface";
import { type IExternalSourceType } from "./types/ExternalSourceType.interface";

const RepositoryContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<IExternalSourceType>("CoingateRepository")
        .to(CoingateRepository)
        .inSingletonScope();
    bind<ICurrencyRepository>("CurrencyRepository")
        .to(CurrencyRedisRepository)
        .inSingletonScope();
});

export { RepositoryContainer };
