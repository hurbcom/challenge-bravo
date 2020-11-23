import { Router } from 'express';
import currencyController from '../../controllers/currency.controller';

export default ({ controller } = { controller: currencyController }) => {
    const { post, index, del } = controller();
    const router = Router();
    
    router.post('/currency', post);
    router.get('/currency', index);
    router.delete('/currency', del);

    return router;
}