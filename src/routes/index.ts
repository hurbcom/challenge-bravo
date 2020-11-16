import { Router } from 'express';
import coinRouter from './coin';
import convertRouter from './convert';

const router = Router();

router.use('/coin', coinRouter);
router.use('/convert', convertRouter);

router.get('/', (req, res) => res.send('Hello, I am working!'));

export default router;
