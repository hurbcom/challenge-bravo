import axios from "axios"
import { Cotation } from "../entity/Cotation"

export class AwesomeApi {

    public getCotation = async (from: string, to: string) : Promise<any> => {
        const cotation: Cotation = await axios.get(`http://economia.awesomeapi.com.br/json/last/${from}-${to}`)
        return cotation
    }

}