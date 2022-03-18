using System;
using System.Collections.Generic;
using api_challenge_bravo.Model;
using CacheManager.Core;
using Newtonsoft.Json.Linq;

namespace api_challenge_bravo.Util
{
    public static class DBCache
    {
        private static readonly ICacheManager<Currency> CurrencyCache;
        private static readonly ICacheManager<List<Currency>> AllCurrenciesCache;

        static DBCache()
        {
            var cfg = ConfigurationBuilder.BuildConfiguration(settings =>
            {
                settings.WithSystemRuntimeCacheHandle()
                    .WithExpiration(ExpirationMode.Absolute, TimeSpan.FromSeconds(1));
            });

            CurrencyCache = CacheFactory.FromConfiguration<Currency>(cfg);
            AllCurrenciesCache = CacheFactory.FromConfiguration<List<Currency>>(cfg);
        }

        public static Currency GetCurrency(string symbol)
        {
            if (CurrencyCache.Get(symbol) == null)
                CurrencyCache.Add(symbol,Currency.Get(symbol));

            return CurrencyCache.Get(symbol);
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