import { Router } from 'express';
import currencyController from '../../controllers/currency.controller';

export default ({ controller } = { controller: currencyController }) => {
    const { post, getAll, del } = controller();
    const router = Router();
    
    router.post('/currency', post);
    router.get('/currency', getAll);
    router.delete('/currency', del);

    return router;
}