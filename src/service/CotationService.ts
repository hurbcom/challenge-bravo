import { AwesomeApi } from "../client/AwesomeApi"
import { Cotation } from "../entity/Cotation"

export class CotationService {

    public get = async (from: string, to: string, amout: number): Promise<Cotation> => {
        const api = new AwesomeApi()
        const cotation = await api.getCotation(from, to)
        return cotation.data[`${from}${to}`]
    }

}