import { Router } from 'express';
import CurrencyController from '../../controllers/currency.controller';

export default () => {
    const { post, index, del } = new CurrencyController();
    const router = Router();
    
    router.post('/currency', post);
    router.get('/currency', index);
    router.delete('/currency', del);

    return router;
}