import app from "./app";
import { Request, Response } from "express";
import { CotationController } from "./controller/CotationController";

app.get("/cotation", (req: Request, res: Response) => {
    const cotationController = new CotationController()
    return cotationController.get(req, res)
})

app.post("/cotation", (req: Request, res: Response) => {
    const cotationController = new CotationController()
    return cotationController.create(req, res)
})

