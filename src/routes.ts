import express from 'express';
import Exchange from './controllers/exchange';

const router = express.Router();

// Exchanges Routes

router.get('/exchange', Exchange.exchange);

export default router;
