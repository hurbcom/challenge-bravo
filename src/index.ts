import app from "./app";
import { Request, Response } from "express";
import { CotationController } from "./controller/CotationController";
import { CoinController } from "./controller/CoinController";

app.get("/cotation", (req: Request, res: Response) => {
    const cotationController = new CotationController()
    return cotationController.get(req, res)
})

app.post("/cotation", (req: Request, res: Response) => {
    const cotationController = new CotationController()
    return cotationController.create(req, res)
})

app.post("/coin", (req: Request, res: Response) => {
    const coinController = new CoinController()
    return coinController.create(req, res)
})
