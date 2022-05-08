import express from 'express';

const router = express.Router();

router.post('/currencies', (req, res) => { res.status(200).json('TODO') });
router.delete('/currencies', (req, res) => { res.status(200).json('TODO') });
router.get('/convert', (req, res) => { res.status(200).json('TODO') });

export default router;