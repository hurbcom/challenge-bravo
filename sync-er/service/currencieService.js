
//Service to build the Json to persist.
module.exports = (data) => {
    return {
        USD: 1,
        BRL: data.BRLUSD.bid,
        EUR: data.EURUSD.bid,
        BTC: data.BTCUSD.bid,
        ETH: data.ETHUSD.bid,
    }
}