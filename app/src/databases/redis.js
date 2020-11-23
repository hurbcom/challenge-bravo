import ExpressRedisCache from 'express-redis-cache';

export default ExpressRedisCache({
    host: 'redis-server',
    expire: 20, 
});