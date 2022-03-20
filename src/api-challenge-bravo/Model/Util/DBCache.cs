using System;
using System.Collections.Generic;
using CacheManager.Core;

namespace api_challenge_bravo.Model.Util
{
    public static class DBCache
    {
        private static readonly ICacheManager<Currency> CurrencyCache;
        private static readonly ICacheManager<List<Currency>> AllCurrenciesCache;

        private const int CACHE_TTL_SECONDS = 1;

        static DBCache()
        {
            var cfg = ConfigurationBuilder.BuildConfiguration(settings =>
            {
                // Set expiration of the DBCache
                settings.WithSystemRuntimeCacheHandle()
                    .WithExpiration(ExpirationMode.Absolute, TimeSpan.FromSeconds(CACHE_TTL_SECONDS));
            });

            CurrencyCache = CacheFactory.FromConfiguration<Currency>(cfg);
            AllCurrenciesCache = CacheFactory.FromConfiguration<List<Currency>>(cfg);
        }
        public static Currency GetCurrency(string symbol)
        {
            try
            {
                if (CurrencyCache.Get(symbol) == null)
                    CurrencyCache.Add(symbol,Currency.Get(symbol));

                return CurrencyCache.Get(symbol);

            }
            catch (Exception)
            {
                return null;
            }
        }
        public static List<Currency> GetAllCurrency()
        {
            if (AllCurrenciesCache.Get("all") == null)
                AllCurrenciesCache.Add("all",Currency.GetAll());

            return AllCurrenciesCache.Get("all");
        }
        public static void CleanCache()
        {
            CurrencyCache.Clear();
            AllCurrenciesCache.Clear();
        }
    }
}