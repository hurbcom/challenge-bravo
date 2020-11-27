import { Router } from 'express';
import Redis from '../../databases/redis';

import ConversionController from '../../controllers/conversion.controller';
import validator from '../middlewares/validators/conversion.validator';

export default () => {
    const redis = Redis.instance;
    const { convert } = new ConversionController();
    const router = Router();
    
    router.get('/conversion', redis.httpCache().route(), validator, convert);

    return router;
}