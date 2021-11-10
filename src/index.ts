import app from "./app";
import { Request, Response, Router } from "express";
import { CotationController } from "./controller/CotationController";

app.get("/cotation", (req: Request, res: Response) => {
    console.log("entrou aqui")
    const cotationController = new CotationController()
    cotationController.get(req, res)
})
