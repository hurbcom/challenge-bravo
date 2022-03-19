using System.Threading.Tasks;
using api_challenge_bravo.Model;

namespace api_challenge_bravo.Services
{
    public static class CurrencyConvertService
    {
        public static async Task<decimal> Convert(string fromSymbol, string toSymbol, decimal amount)
        {
            var fromCurrency = Currency.GetCached(fromSymbol);
            var toCurrency = Currency.GetCached(toSymbol);

            await ExchangeRateUpdateService.CheckTTLForNewUpdate(fromCurrency.Symbol);
            await ExchangeRateUpdateService.CheckTTLForNewUpdate(toCurrency.Symbol);

            var ExchangeRate = fromCurrency.ExchangeRateInUSD / toCurrency.ExchangeRateInUSD;

            return amount * ExchangeRate;
        }
    }
}