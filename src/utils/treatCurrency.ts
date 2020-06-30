/**
 * Treats the currencies to keep a default value between all
 */

 export default function treatCurrency(baseCurrency: number, treatedCurrency: number): number{
    const result =  treatedCurrency / baseCurrency;
    return result;
 }