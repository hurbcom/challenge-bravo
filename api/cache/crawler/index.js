const { startBrowser } = require('./browser');
const InvestingScrapper = require('./scrapper/InvestingCurrenciesScrapper');
const InvestingCryptoScrapper = require('./scrapper/InvestingCryptoScrapper');

const currencies = new InvestingScrapper('');
const crypto = new InvestingCryptoScrapper('');


async function exchanges () {
    const browser = await startBrowser();
    const [coins, cryptoCoins] = await Promise.all([currencies.scrap(browser), crypto.scrap(browser)]);

    browser.close();

    return {
        ...coins,
        ...cryptoCoins
    };
}

module.exports = exchanges;