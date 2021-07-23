import { Request, Response } from 'express';

export class CurrenciesController {
  public async store(req: Request, res: Response): Promise<Response> {
    return res.json({ ok: true });
  }

  public async index(req: Request, res: Response): Promise<Response> {
    return res.json({ ok: true });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    return res.json({ ok: true });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    return res.json({ ok: true });
  }

  public async destroy(req: Request, res: Response): Promise<Response> {
    return res.json({ ok: true });
  }
}
