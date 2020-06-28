import { Request, Response } from "express";
import ExchangeService from "@services/ExchangeService";

class ExchangeController {

  async exchange(req: Request, res: Response) {
    try {
      const { from, to, amount } = req.query;


    } catch (error) {
      res.status(500).send({ error });
    }
  }

}

export default new ExchangeController();