import { Router } from 'express';
import { instance as redis } from '../../databases/redis';

import ConversionController from '../../controllers/conversion.controller';
import validator from '../middlewares/validators/conversion.validator';

export default () => {
    const { convert } = new ConversionController();
    const router = Router();
    
    router.get('/conversion', validator, redis.cache.route(), convert);

    return router;
}