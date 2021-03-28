const redis = require("redis");
const client = redis.createClient(6379, "redis");
const util = require("util");
const getAsync = util.promisify(client.get).bind(client);

client.on("error", function (error) {
    console.error(error);
});

const getFromCache = async (url) => {
    let value = await getAsync(url);
    return JSON.parse(value);
};

const putToCache = (url, quote) => {
    client.setex(url, 3600, JSON.stringify(quote), (err, data) => {
        if (err) console.log(err);
    });
    return;
};

module.exports = {
    getFromCache,
    putToCache,
};

// const Redis = require('ioredis')

// function getConnection() {
//     return new Redis('redis://redis')
// }

// var redis = getConnection()

// function putToCache(glbid, data) {
//     redis.set(glbid, data)
// };

// async function getFromCache(glbid) {
//     let resultF;
//     const result = redis.get(glbid)
//         .then(data => {
//             console.log(data)
//             resultF = data
//         })

//     return resultF
// };

// module.exports = {
//     getFromCache,
//     putToCache
// };
