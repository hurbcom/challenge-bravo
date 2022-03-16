using System;
using api_challenge_bravo.Model;

namespace api_challenge_bravo.Services
{
    public class CurrencyConvertService
    {
        public static decimal Convert(string fromSymbol, string toSymbol, decimal amount)
        {
            var fromCurrencyExchangeRate = Currency.Get(fromSymbol).ExchangeRateInUSD;
            var toCurrencyExchangeRate = Currency.Get(toSymbol).ExchangeRateInUSD;

            var ExchangeRate = fromCurrencyExchangeRate / toCurrencyExchangeRate;

            return amount * ExchangeRate;
        }
    }
}