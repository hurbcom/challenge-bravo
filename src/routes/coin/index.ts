import { Router } from 'express';
import { createCoinController } from '../../useCases/CreateCoin';
import { deleteCoinController } from '../../useCases/DeleteCoin';
import { getCoinsController } from '../../useCases/GetCoins';
import { updateCoinController } from '../../useCases/UpdateCoin';

const router = Router();

router.get('/', (request, response) =>
  getCoinsController.handle(request, response)
);

router.post('/', (request, response) =>
  createCoinController.handle(request, response)
);

router.put('/:uid', (request, response) =>
  updateCoinController.handle(request, response)
);

router.delete('/:uid', (request, response) =>
  deleteCoinController.handle(request, response)
);

export default router;
