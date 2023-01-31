import express from 'express';

const router = express.Router();

// Import the conversion controller
import { conversionController } from '../controllers/conversion.controller';

// Define the conversion endpoint
router.get('/convert', async (req: any, res) => await conversionController(req, res));

export default router;