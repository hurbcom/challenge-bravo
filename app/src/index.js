import server from './api/server';
import mongoConnect from './databases/mongo';

(async () => {
    try {
        await mongoConnect();
        server.start();
    } catch (e) {
        console.error(e);
    }
})();