if (process.env.NODE_ENV === 'test')
    client = null
else {
    const redis = require('redis')

    const client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    })

    client.on("error", function (err) {
        console.log("Redis error encountered", err);
        client.quit()
    });
}

module.exports = ({ }) => client