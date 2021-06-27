const puppeteer = require('puppeteer');

async function startBrowser(){
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
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
