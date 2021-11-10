import { Cotation } from "../entity/Cotation"
import { CotationService } from "../service/CotationService"
import { Request, Response } from "express"
import { ValidationUtil } from "../util/ValidationUtil"

export class CotationController {

    public get = async (req: Request, res: Response) => {
        if(!ValidationUtil.validValue(req.query.from) 
            || !ValidationUtil.validValue(req.query.to) 
            || !ValidationUtil.validValue(req.query.amount)) {

            return res.status(400).send("Dados inválidos.")

        }

        const cotationService = new CotationService()
        const cotation = await cotationService.get(req.query.from as string, req.query.to as string, Number(req.query.amout))
        
        res.send(`Conversion from ${req.query.from} to ${req.query.to} is: ${Number(req.query.amount) * Number(cotation.ask)}`)
    
    }


}