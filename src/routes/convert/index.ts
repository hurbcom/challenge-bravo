import { Router } from 'express';
import { convertCoinController } from '../../useCases/ConvertCoin';

const router = Router();

router.get('/', (req, res) => {
  convertCoinController.handle(req, res);
});

export default router;
