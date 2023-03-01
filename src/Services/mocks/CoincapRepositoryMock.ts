import { injectable } from "inversify";
import { type IExternalSourceType } from "../Currency";

@injectable()
export class CoincapRepositoryMock implements IExternalSourceType {
    async getExternalDollarValue(id: string) {
        return 0.5;
    }
}
