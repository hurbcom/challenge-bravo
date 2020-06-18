//função para executar outras funções de tempo em tempo
module.exports = (timestamp, callback) => {
    setInterval(async () => {
        await callback()
    }, timestamp)
}
