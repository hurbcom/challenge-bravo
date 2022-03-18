using System;
using System.Threading.Tasks;
using api_challenge_bravo.Model;

namespace api_challenge_bravo.Services
{
    public static class CurrencyConvertService
    {
        public static async Task<decimal> Convert(string fromSymbol, string toSymbol, decimal amount)
        {
            var fromCurrency = Currency.Get(fromSymbol);
            var toCurrency = Currency.Get(toSymbol);

            await ExchangeRateUpdateService.CheckTTLForNewUpdate(fromCurrency.Symbol);
            await ExchangeRateUpdateService.CheckTTLForNewUpdate(toCurrency.Symbol);

            var ExchangeRate = fromCurrency.ExchangeRateInUSD / toCurrency.ExchangeRateInUSD;

            return amount * ExchangeRate;
        }
    }
}