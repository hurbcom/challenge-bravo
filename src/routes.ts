import express from 'express';
import { currencyController } from './controllers';

const router = express.Router();

router.post('/fictitious-currencies', (req, res) =>
  currencyController.addFictitiousCurrency(req, res),
);
router.post('/real-currencies', (req, res) => currencyController.addRealCurrency(req, res));
router.delete('/currencies', (req, res) => currencyController.deleteCurrency(req, res));
router.get('/exchange', (req, res) => currencyController.exchangeCurrency(req, res));

export default router;
