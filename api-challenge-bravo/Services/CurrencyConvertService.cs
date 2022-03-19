using System;
using System.Threading.Tasks;
using api_challenge_bravo.Model;

namespace api_challenge_bravo.Services
{
    public static class CurrencyConvertService
    {
        public static async Task<Tuple<decimal, DateTime>> Convert(string fromSymbol, string toSymbol, decimal amount)
        {
            await ExchangeRateUpdateService.CheckTTLForNewUpdate(fromSymbol);
            await ExchangeRateUpdateService.CheckTTLForNewUpdate(toSymbol);

            var fromCurrencyUpdated = Currency.GetCached(fromSymbol);
            var toCurrencyUpdated = Currency.GetCached(toSymbol);

            var ExchangeRate = fromCurrencyUpdated.ExchangeRateInUSD / toCurrencyUpdated.ExchangeRateInUSD;

            var resultAmount = amount * ExchangeRate;
            var resultLastUpdate = getConvertUpdateTime(fromCurrencyUpdated,toCurrencyUpdated);

            return new Tuple<decimal, DateTime>(resultAmount, resultLastUpdate);
        }

        private static DateTime getConvertUpdateTime(Currency fromCurrency, Currency toCurrency)
        {
            // In case only fromCurrency is not an AutoUpdateble return LastUpdate from toCurrency
            if (!fromCurrency.AutoUpdateExchangeRate && toCurrency.AutoUpdateExchangeRate)
                return toCurrency.LastTimeUpdatedExchangeRateUTC;
            // In case only toCurrency is not an AutoUpdateble return LastUpdate from fromCurrency
            if (fromCurrency.AutoUpdateExchangeRate && !toCurrency.AutoUpdateExchangeRate)
                return fromCurrency.LastTimeUpdatedExchangeRateUTC;

            // In all other cases return the min value os LastUpdate
            var minDateTime = fromCurrency.LastTimeUpdatedExchangeRateUTC <=
                              toCurrency.LastTimeUpdatedExchangeRateUTC
            ? fromCurrency.LastTimeUpdatedExchangeRateUTC
            : toCurrency.LastTimeUpdatedExchangeRateUTC;

            return minDateTime;
        }
    }
}