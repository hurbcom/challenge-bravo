import axios from "axios";

export const QUOTATION_API = "https://economia.awesomeapi.com.br/json";

export const ALL_COINS = ["BRL", "EUR", "BTC", "ETH"];

export const quotations = async () => {
    const allQuotations = await Promise.all<object>(
        ALL_COINS.map(async (coins) => {
            const request = await axios.get(
                `${QUOTATION_API}/last/${coins}-USD`
            );
            return request.data;
        })
    );
    return allQuotations;
};
