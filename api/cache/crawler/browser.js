const puppeteer = require('puppeteer-core');

async function startBrowser() {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.CHROME_BIN,
            args: ['--no-sandbox', "--disable-setuid-sandbox", "--disable-gpu"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log('Ocorreu um erro ao executar o browser do puppeteer', err);
        throw err;
    }
    return browser;
}

module.exports = {
    startBrowser
};
