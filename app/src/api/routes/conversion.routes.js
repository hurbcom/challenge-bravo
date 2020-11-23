import { Router } from 'express';
import { cache as redisCache } from '../../databases/redis';

import conversionController from '../../controllers/conversion.controller';
import validator from '../middlewares/validators/conversion.validator';


export default ({ controller, cache } = { controller: conversionController(), cache: redisCache }) => {
    const { convert } = controller;
    const router = Router();
    
    router.get('/conversion', validator, cache.route(), convert);

    return router;
}