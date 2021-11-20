import axios from "axios"
import dotenv from 'dotenv'
import { Cotation } from "../entity/Cotation"

export class AwesomeApi {

    constructor() {
        dotenv.config()
    }

    public getCotation = async (from: string, to: string) : Promise<any> => {
        const cotation: Cotation = await axios.get(`${process.env.API_AWESOME}json/last/${from}-${to}`)
        return cotation
    }

}