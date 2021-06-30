export default {
    TTL: +process.env.CACHE_TTL_SECONDS,
    data: {
        deleteOnExpire: true,
        useClones: true
    }
};