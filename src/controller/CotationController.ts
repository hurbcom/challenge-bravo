import { Cotation } from "../entity/Cotation"
import { CotationService } from "../service/CotationService"
import { Request, Response } from "express"
import { ValidationUtil } from "../util/ValidationUtil"
import Controller from "./ControllerInterface"
import { Router } from "express"

export class CotationController implements Controller {

    public path = '/cotations';
    public router = Router();

    private cotationService: CotationService

    constructor() {
        this.router.get(`${this.path}`, this.get)
        this.router.post(`${this.path}`, this.create)
        this.router.delete(`${this.path}/:id`, this.delete)
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
            res.send(`Conversion from ${req.query.from} to ${req.query.to} is: ${Number(req.query.amount) * Number(cotation.ask)}`)
        } else {
            res.status(404)
        }

    }

    public create = async (req: Request, res: Response) => {
        const cotation = req.body as Cotation

        if (cotation != null && cotation != undefined) {

            const createdCotation = await this.cotationService.create(cotation)
            res.status(201).send(createdCotation)

        } else {
            res.status(500).send("Can't possible create cotation")
        }
    }

    public delete = async (req: Request, res: Response) => {

        if(!ValidationUtil.validValue(req.params.id)) {
            return res.status(400).send("Invalid parameters")
        }

        await this.cotationService.delete(Number(req.params.id))
        return res.status(200).send()

    }

}