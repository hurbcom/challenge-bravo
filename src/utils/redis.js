const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

client.on('error', function(err) {
    console.log('Error:', err);
});

module.exports = {
    getAsync: async key => {
        return new Promise((resolve, reject) => {
            client.get(key, (err, reply) => {
                if (err) reject(null);

                resolve(reply);
            });
        });
    },
    setAsync: async (key, value) => {
        return new Promise((resolve, reject) => {
            // Além de salvar o valor na chave, também dá um tempo de expiração para ela
            // definido no arquivo de config
            client.set(key, value, function(err, reply) {
                if (err) reject(null);
                resolve(true);
            });
        });
    },
    // Limpa todas as chaves de todas as databases
    cleanAll: async () => {
        return new Promise((resolve, reject) => {
            client.flushall(function(err, reply) {
                if (err) reject(null);
                resolve(true);
            });
        });
    }
};
