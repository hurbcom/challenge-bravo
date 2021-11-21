import { AwesomeApi } from "../client/AwesomeApi"
import { Cotation } from "../entity/Cotation"
import { CotationRepository } from '../repository/CotationRepository'
import { CacheService } from "./CacheService"
import { CotationAlreadyExistsError } from "../error/CotationAlreadyExistsError"

export class CotationService {

    private cotationRepository: CotationRepository
    private cacheService: CacheService

    constructor() {
        this.cotationRepository = new CotationRepository()
        this.cacheService = new CacheService()
    }

    public get = async (from: string, to: string): Promise<any> => {
        const api = new AwesomeApi()

        try {

            const cotationFromCache = await this.cacheService.get(`${from}-${to}`)

            if (!cotationFromCache) {
                const cotation = await api.getCotation(from, to)
                const formatedCotation = cotation.data[`${from}${to}`] as Cotation

                await this.cacheService.set(`${from}-${to}`, JSON.stringify(formatedCotation))

                return formatedCotation
            }

            return JSON.parse(cotationFromCache) as Cotation


        } catch (error) {
            const cotationFromDatabase = this.getDatabaseByCodeAndCodeIn(from, to)

            if (cotationFromDatabase) {
                await this.cacheService.set(`${from}-${to}`, JSON.stringify(cotationFromDatabase))
                return cotationFromDatabase
            } else {
                return null
            }
        }
    }

    public create = async (cotation: Cotation): Promise<any> => {

        const cotationFromDatabase = await this.cotationRepository.getByCodeAndCodeIn(cotation.code, cotation.codein)

        if(cotationFromDatabase) {
            throw new CotationAlreadyExistsError()
        }

        cotation.createDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        cotation.timestamp = new Date().getTime().toString()
        return await this.cotationRepository.create(cotation)
    }

    public getDatabaseByCodeAndCodeIn = async (code: string, codeIn: string): Promise<any> => {
        return await this.cotationRepository.getByCodeAndCodeIn(code, codeIn)
    }

    public deleteByCodeAndCodein = async (code: string, codein: string): Promise<any> => {
        return await this.cotationRepository.deleteByCodeAndCodein(code, codein)
    }

}