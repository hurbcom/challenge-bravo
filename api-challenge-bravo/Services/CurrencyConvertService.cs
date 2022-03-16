using System;
using api_challenge_bravo.Model;

namespace api_challenge_bravo.Services
{
    public class CurrencyConvertService
    {
        public static decimal Convert(string fromSymbol, string toSymbol, decimal amount)
        {
            var fromCurrency = Currency.Get(fromSymbol);
            var toCurrency = Currency.Get(toSymbol);

            ExchangeRateUpdateService.CheckTTLForNewUpdate(fromCurrency);
            ExchangeRateUpdateService.CheckTTLForNewUpdate(toCurrency);

            var ExchangeRate = fromCurrency.ExchangeRateInUSD / toCurrency.ExchangeRateInUSD;

            return amount * ExchangeRate;
        }
    }
}