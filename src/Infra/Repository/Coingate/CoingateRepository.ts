import axios from "axios";
import { injectable } from "inversify";
import { type IExternalSourceType } from "../types/ExternalSourceType.interface";

@injectable()
export class CoingateRepository implements IExternalSourceType {
    async getExternalDollarValue(currencyId: string) {
        const { data } = await axios.get<string | null>(
            `https://api.coingate.com/api/v2/rates/merchant/${currencyId}/USD`
        );
        const dolarRate = Number(data);
        if (data !== "" && dolarRate != null && !Number.isNaN(dolarRate))
            return dolarRate;
        return null;
    }
}
