
exports.read = (key) => {
    return global.client.get(key).then(valueRedis => {
        return JSON.parse(valueRedis)
    })
}