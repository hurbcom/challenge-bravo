import { Request, Response, Router } from "express";
import { CotationController } from "./controller/CotationController";

export default (router: Router): void => {
    router.get("/cotation", (req: Request, res: Response) => {
        const cotationController = new CotationController()
        cotationController.get(req, res)
    })

    
}
