import { Cotation } from "../entity/Cotation"
import { CotationService } from "../service/CotationService"
import { Request, Response } from "express"
import { ValidationUtil } from "../util/ValidationUtil"
import Controller from "./ControllerInterface"
import { Router } from "express"
import { CotationAlreadyExistsError } from "../error/CotationAlreadyExistsError"

export class CotationController implements Controller {

    public path = '/cotations';
    public router = Router();

    private cotationService: CotationService

    constructor() {
        this.router.get(`${this.path}`, this.get)
        this.router.post(`${this.path}`, this.create)
        this.router.delete(`${this.path}`, this.delete)
        this.cotationService = new CotationService()
    }

    public get = async (req: Request, res: Response) => {
        if (!ValidationUtil.validValue(req.query.from)
            || !ValidationUtil.validValue(req.query.to)
            || !ValidationUtil.validValue(req.query.amount)) {

            return res.status(400).send("Invalid parameters.")
        }

        const cotation = await this.cotationService.get(req.query.from as string, req.query.to as string)

        if (ValidationUtil.validValue(cotation)) {
            const convertedAmount = (Number(req.query.amount) * Number(cotation.ask)).toFixed(2)
            res.send(`Conversion from ${req.query.from} to ${req.query.to} is: ${convertedAmount}`)
        } else {
            res.status(404)
        }

    }

    public create = async (req: Request, res: Response) => {
        const cotation = req.body as Cotation

        if (cotation != null && cotation != undefined) {

            try {
                const createdCotation = await this.cotationService.create(cotation)
                res.status(201).send(createdCotation)
            } catch (error) {
                if (error instanceof CotationAlreadyExistsError) {
                    res.status(400).send(error.message)
                } else {
                    res.status(500).send()
                }
            }

        } else {
            res.status(400).send("Can't possible create cotation")
        }
    }

    public delete = async (req: Request, res: Response) => {    

        if(!ValidationUtil.validValue(req.query.code) || !ValidationUtil.validValue(req.query.codein)) {
            return res.status(400).send("Invalid parameters")
        }

        await this.cotationService.deleteByCodeAndCodein(req.query.code as string, req.query.codein as string)
        return res.status(200).send()

    }

}