import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCurrencyService } from '@services/CreateCurrencyService';
import { DeleteCurrencyService } from '@services/DeleteCurrencyService';
import { ListAllCurrenciesService } from '@services/ListAllCurrenciesService';
import { ListOneCurrencyService } from '@services/ListOneCurrencyService';
import { UpdateCurrencyService } from '@services/UpdateCurrencyService';

export class CurrenciesController {
  public async store(req: Request, res: Response): Promise<Response> {
    const { code, backingCurrency } = req.body;

    const createCurrencyService = container.resolve(CreateCurrencyService);

    const currency = await createCurrencyService.execute({
      code,
      backingCurrency,
    });

    return res.json({ currency });
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const listAllCurrenciesService = container.resolve(
      ListAllCurrenciesService,
    );

    const { count, currencies } = await listAllCurrenciesService.execute();

    return res.json({ count, currencies });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { code } = req.params;

    const listOneCurrencyService = container.resolve(ListOneCurrencyService);

    const currency = await listOneCurrencyService.execute({ code });

    return res.json({ currency });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { code, backingCurrency } = req.body;

    const updateCurrencyService = container.resolve(UpdateCurrencyService);

    const currency = await updateCurrencyService.execute({
      code,
      backingCurrency,
    });

    return res.json({ currency });
  }

  public async destroy(req: Request, res: Response): Promise<Response> {
    const { code } = req.params;

    const deleteCurrencyService = container.resolve(DeleteCurrencyService);

    await deleteCurrencyService.execute({ code });

    return res.status(204).send();
  }
}
