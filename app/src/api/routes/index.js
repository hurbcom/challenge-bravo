import { Router } from 'express';
import conversion from './conversion.routes';
import currency from './currency.routes';

export default () => {
    const router = Router();
    
    router.use(conversion());
    router.use(currency());

    return router;
}