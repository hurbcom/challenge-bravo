import express from 'express';
import exchangeController from './controllers/exchange';

const router = express.Router();

// Exchanges Routes

router.get('/exchange', exchangeController.exchange);

export default router;
