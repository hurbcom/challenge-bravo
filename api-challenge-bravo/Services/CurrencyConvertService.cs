using System;
using System.Threading.Tasks;
using api_challenge_bravo.Model;

namespace api_challenge_bravo.Services
{
    public static class CurrencyConvertService
    {
        public static async Task<Tuple<decimal, DateTime>> Convert(Currency fromCurrency, Currency toCurrency, decimal amount)
        {
            await ExchangeRateUpdateService.CheckTTLForNewUpdate(fromCurrency.Symbol);
            await ExchangeRateUpdateService.CheckTTLForNewUpdate(toCurrency.Symbol);

            var fromCurrencyUpdated = Currency.GetCached(fromCurrency.Symbol);
            var toCurrencyUpdated = Currency.GetCached(toCurrency.Symbol);

            var ExchangeRate = fromCurrencyUpdated.ExchangeRateInUSD / toCurrencyUpdated.ExchangeRateInUSD;

            var resultAmount = amount * ExchangeRate;
            var resultLastUpdate = getConvertUpdateTime(fromCurrencyUpdated,toCurrencyUpdated);

            return new Tuple<decimal, DateTime>(resultAmount, resultLastUpdate);
        }

        private static DateTime getConvertUpdateTime(Currency fromCurrency, Currency toCurrency)
        {
            // In case only fromCurrency is not an AutoUpdateble return LastUpdate from toCurrency
            if (!fromCurrency.AutoUpdateExchangeRate && toCurrency.AutoUpdateExchangeRate)
                return toCurrency.LastTimeUpdatedExchangeRate;
            // In case only toCurrency is not an AutoUpdateble return LastUpdate from fromCurrency
            if (fromCurrency.AutoUpdateExchangeRate && !toCurrency.AutoUpdateExchangeRate)
                return fromCurrency.LastTimeUpdatedExchangeRate;

            // In all other cases return the min value os LastUpdate
            var minDateTime = fromCurrency.LastTimeUpdatedExchangeRate <=
                              toCurrency.LastTimeUpdatedExchangeRate
            ? fromCurrency.LastTimeUpdatedExchangeRate
            : toCurrency.LastTimeUpdatedExchangeRate;

            return minDateTime;
        }
    }
}