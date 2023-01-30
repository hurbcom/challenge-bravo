import express from 'express';

const router = express.Router();

// Import the conversion controller
import { conversionController } from '../controllers/conversion.controller';

// Define the conversion endpoint
router.get('/convert', async (req, res) => {
  try {
    const convertedAmount = await conversionController(req, res);
    res.send({ convertedAmount });
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default router;