import { AwesomeApi } from "../client/AwesomeApi"
import { Cotation } from "../entity/Cotation"
import { CotationRepository } from "../repository/CotationRepository"

export class CotationService {

    public get = async (from: string, to: string, amout: number): Promise<Cotation> => {
        const api = new AwesomeApi()
        const cotation = await api.getCotation(from, to)
        return cotation.data[`${from}${to}`]
    }

    public create = async (cotation: Cotation): Promise<Cotation> => {
        const cotationRepositoy = new CotationRepository()
        const createdCotation = await cotationRepositoy.create(cotation)
        return createdCotation

    }

}