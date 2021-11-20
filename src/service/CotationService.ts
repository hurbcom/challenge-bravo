import { AwesomeApi } from "../client/AwesomeApi"
import { Cotation } from "../entity/Cotation"
import { CotationRepository } from '../repository/CotationRepository'

export class CotationService {

    private cotationRepository: CotationRepository
    
    constructor() {
        this.cotationRepository = new CotationRepository()
    }

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

    public create = async (cotation: Cotation): Promise<any> => {
        cotation.createDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        cotation.timestamp = new Date().getTime().toString()
        return await this.cotationRepository.create(cotation)
    }

    public getDatabaseByCodeAndCodeIn = async (code: string, codeIn: string) : Promise<any> => {
        return await this.cotationRepository.getByCodeAndCodeIn(code, codeIn)
    }

    public delete = async (id: number) : Promise<any> => {
        return await this.cotationRepository.deleteById(id)
    }

}