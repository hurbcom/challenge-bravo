import express from 'express';
import { currencyController } from './controllers';

const router = express.Router();

router.post('/currencies', (req, res) => currencyController.addRealCurrency(req, res));
router.delete('/currencies', (req, res) => {
  res.status(200).json('TODO');
});
router.get('/convert', (req, res) => {
  res.status(200).json('TODO');
});

export default router;
