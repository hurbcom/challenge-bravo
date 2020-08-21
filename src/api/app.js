module.exports = ({ server }) => {
    return {
        start: () =>
            Promise.resolve().then(server.start)
    }
}