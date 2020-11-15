import { Router } from 'express';
import conversion from './conversion';

export default () => {
    const router = Router();

    router.use(conversion());

    return router;
}