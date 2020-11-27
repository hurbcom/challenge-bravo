import server from './api/server';
import mongoConnect from './databases/mongo';
import redisConnect from './databases/redis';
import env from './config/env';

(async () => {
    try {
        redisConnect();
        await mongoConnect();
        
        const app = server.start();
        app.listen(env.port, () => {
            console.log(`Bravo Currency Exchange API is listening on port ${env.port}`);
        });
    } catch (e) {
        console.error(e);
    }
})();