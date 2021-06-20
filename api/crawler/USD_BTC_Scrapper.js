const cheerio = require('cheerio');
const { getPageInvestingBr } = require('./request');

class USD_BTC_Scrapper{
    constructor(){
        this.getPageInvestingBr = getPageInvestingBr;
        this.cheerio = cheerio;
    }

    async scrap(){
        const html = await this.getPageHtml();
        const $ = cheerio.load(html);

        return $('pid-1055298-last').text();
    }

    getPageHtml(){
        return getPageInvestingBr('usd-btc');
    }
}

module.exports = USD_BTC_Scrapper;