import { Router } from 'express';
import exchange from './exchange';

export default () => {
    const router = Router();

    router.use(exchange());

    return router;
}