module.exports = (timestamp, callback) => {
    setInterval(async () => {
        await callback()
    }, timestamp)
}
