const USD_BTC_Scrapper = require('./USD_BTC_Scrapper');

const btc = new USD_BTC_Scrapper();


async function f() {
    const btcToUSD = await btc.scrap();

    console.log(btcToUSD);
    return btcToUSD;
}

f();

// module.exports = () => {
//     const btcToUSD = btc.scrap();

//     return btcToUSD;
// }