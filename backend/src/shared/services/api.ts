import axios from "axios";
import appConfig from "@config/app";

export const api = axios.create({
    // baseURL: 'http://api.currencylayer.com/'
    baseURL: "https://rest.coinapi.io/v1/assets",
    headers: {
        "X-CoinAPI-Key": `${appConfig.EXCHANGE_API.apiKey}`,
    },
});
