using System;
using System.Threading.Tasks;

namespace api_challenge_bravo.Services.Util.ExternalCurrencyAPI
{
    public static class ExternalCurrencyAPI
    {
        private static IExternalCurrencyAPI _externalCurrencyApi;

        public static void Registry(IExternalCurrencyAPI externalCurrencyApi) =>
            _externalCurrencyApi = externalCurrencyApi;

        public static Task<Tuple<decimal, DateTime>> GetExchangeRate(string symbol) =>
            _externalCurrencyApi.GetExchangeRate(symbol);

        public static bool CheckAvailabilityOfAutoUpdater(string symbol) =>
            _externalCurrencyApi.CheckAvailabilityOfAutoUpdater(symbol);
    }
}