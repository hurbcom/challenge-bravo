import { AwesomeApi } from "../client/AwesomeApi"
import { Cotation } from "../entity/Cotation"
import { CotationRepository } from "../repository/CotationRepository"

export class CotationService {

    public get = async (from: string, to: string): Promise<any> => {
        const api = new AwesomeApi()

        try {
            const cotation = await api.getCotation(from, to)
            return cotation.data[`${from}${to}`]
        } catch (error) {
            console.log("Não foi possível obter cotação da api externa")
            const cotationFromDatabase = this.getDatabaseByCodeAndCodeIn(from, to)
            return (!cotationFromDatabase) ? null : cotationFromDatabase
        }
        
    }

    public create = async (cotation: Cotation): Promise<Cotation> => {
        const cotationRepositoy = new CotationRepository()
        const createdCotation = await cotationRepositoy.create(cotation)
        return createdCotation
    }

    public getDatabaseByCodeAndCodeIn = async (code: string, codeIn: string) : Promise<Cotation> => {
        const cotationRepositoy = new CotationRepository();
        const cotation = await cotationRepositoy.getByCodeAndCodeIn(code, codeIn)
        return cotation
    }

}