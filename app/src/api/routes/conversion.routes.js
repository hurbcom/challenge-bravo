import { Router } from 'express';
import conversionController from '../../controllers/conversion.controller';

export default ({ controller } = { controller: conversionController() }) => {
    const { convert } = controller;
    const router = Router();
    
    router.get('/conversion', convert);

    return router;
}