import { Router } from 'express';
import conversion from './conversion.routes';

export default () => {
    const router = Router();

    router.use(conversion());

    return router;
}