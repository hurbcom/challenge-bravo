import * as cron from 'node-cron';
import { Currency, currencyModel, CurrencyType } from "../models/CurrencyModel";
import axios from "axios";
import BigNumber from "bignumber.js";
import * as cheerio from 'cheerio';

class UpdateRates {
    private allUsdQuoteRate: any[] = [];
    private allMCQuoteMap: any[] = [];
    public async startCron() {
        cron.schedule('* * * * *', this.updateAll);
        this.updateAll();
    }

    private async updateAll() {
        await this.getCoinAPI();
        let coins: Currency[] = await currencyModel.getCurrencies();
        for (let i = 0; i < coins.length; i++) {
            if (coins[i].symbol !== 'USD')
                coins[i].rate = await this.getTax(coins[i]);
        }
        currencyModel.addCurrencies(coins);
    }

    private async getCoinAPI() {
        let url = 'https://rest.coinapi.io/v1/exchangerate/USD';
        try {
            let resp = await axios.get(url, { headers: { 'X-CoinAPI-Key': process.env.COINAPIKEY } });
            this.allUsdQuoteRate = resp.data?.rates;
            // resp.data.rates.forEach((item: any) => {
            //     if (item.asset_id_quote == 'BRL')
            //         console.log(item);
            // })
        } catch (err) {
            console.log(err);
            throw err;
        }

        try {
            let resp: any = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', { headers: { 'X-CMC_PRO_API_KEY': process.env.MCAPIKEY } });
            if (resp.data?.data) {
                this.allMCQuoteMap = resp.data?.data;
            }
        } catch (err: any) {
            console.log(err.response.data)
        }
        return true;
    }

    private async getCoinMCPI(id: string) {
        try {
            let resp: any = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`, { headers: { 'X-CMC_PRO_API_KEY': process.env.MCAPIKEY } });
            if (resp.data?.data && resp.data?.data[id] && resp.data?.data[id].quote && resp.data?.data[id].quote['USD']) {
                return resp.data?.data[id].quote['USD'].price;
            } else return null;
        } catch (err: any) {
            console.log(err?.response?.data);
            throw new Error('get Cotation Error');
        }
    }

    public async getTax(coin: Currency) {
        let taxObj = this.allUsdQuoteRate.find((c) => c.asset_id_quote == coin.symbol);
        if (taxObj?.rate)
            return new BigNumber(1).dividedBy(taxObj.rate).toFixed(30);
        taxObj = this.allMCQuoteMap.find((d) => d.symbol == coin.symbol);
        if (taxObj?.id) {
            let price = await this.getCoinMCPI(taxObj?.id)
            if (price)
                return new BigNumber(price).toFixed(30);
        }
        if (coin.type == CurrencyType.fixed)
            return coin.rate;
        else if (coin.type == CurrencyType.scrapper) {
            let rateAssetUsdRate = 1, rate = '1', amount = '1';
            if (coin.scrpprRateAsset) {
                try {
                    rateAssetUsdRate = (await currencyModel.getCurrency(coin.scrpprRateAsset)).rate;
                } catch (err) {
                    console.log(err);
                    throw new Error('Invalid rate currency');
                }
            }
            if (coin.scrpprUrl?.trim())
                try {
                    let resp = await axios.get(coin.scrpprUrl);
                    if (resp.data && coin.scrpprRateTag) {
                        const $ = cheerio.load(resp.data);
                        let textArr = $(coin.scrpprRateTag).text().split(' ');
                        let textA = textArr.find((item) => item.indexOf('$') >= 0);
                        if (textA)
                            rate = this.formatTextToNumber(textA, coin.scrpprDecimalSymbol || ',');
                        else throw new Error('Invalid scrapper rate tag');
                        if (coin.scrpprAmountTag) {
                            let textArrB = $(coin.scrpprAmountTag).text().split(' ');
                            let textB = textArrB.find((item) => item.indexOf('$') >= 0);
                            if (textB) {
                                amount = this.formatTextToNumber(textB, coin.scrpprDecimalSymbol || ',');
                            } else throw new Error('Invalid scrapper amount tag');
                        }
                        return new BigNumber(rate).dividedBy(amount).multipliedBy(rateAssetUsdRate).toFixed(30);
                    } else throw new Error('Scrapper invalid');

                } catch (err) {
                    throw new Error('Scrapper Error');
                }
            else throw new Error('Scrapper url need to be informed');
        }
        else throw new Error('Invalid currency or type');


    }

    private formatTextToNumber(numberStr: string, decimalSymbol: string) {
        if (decimalSymbol == ',') {
            return numberStr.replace(/[^\d,]|\.(?=.*\.)/g, '').replace(',', '.');
        } else
            return numberStr.replace(/[^\d.]|\.(?=.*\.)/g, '');
    }


}

export const updateRates = new UpdateRates();