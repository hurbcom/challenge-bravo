import { Router } from 'express';
import conversionController from '../../controllers/conversion.controller';
import validator from '../middlewares/validators/conversion.validator';

export default ({ controller } = { controller: conversionController() }) => {
    const { convert } = controller;
    const router = Router();
    
    router.get('/conversion', validator, convert);

    return router;
}