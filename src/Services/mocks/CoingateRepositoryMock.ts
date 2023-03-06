import { injectable } from "inversify";
import { type IExternalSourceType } from "../../Infra/Repository/types/ExternalSourceType.interface";

@injectable()
export class CoingateRepositoryMock implements IExternalSourceType {
    async getExternalDollarValue(id: string) {
        return 0.5;
    }
}
