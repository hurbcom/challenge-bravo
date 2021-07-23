import { Request, Response } from 'express';

export class CurrencyConverterController {
  public async show(req: Request, res: Response): Promise<Response> {
    return res.json({ ok: true });
  }
}
