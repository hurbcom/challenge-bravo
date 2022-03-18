using System;
using api_challenge_bravo.Model;
using CacheManager.Core;
using Newtonsoft.Json.Linq;

namespace api_challenge_bravo.Util
{
    public static class DBCache
    {
        private static readonly ICacheManager<Currency> CurrencyCache;

        static DBCache()
        {
            var cfg = ConfigurationBuilder.BuildConfiguration(settings =>
            {
                settings.WithSystemRuntimeCacheHandle()
                    .WithExpiration(ExpirationMode.Absolute, TimeSpan.FromSeconds(5));
            });

            CurrencyCache = CacheFactory.FromConfiguration<Currency>(cfg);
        }

        public static Currency GetCurrency(string symbol)
        {
            if (CurrencyCache.Get(symbol) == null)
                CurrencyCache.Add(symbol,Currency.Get(symbol));

            return CurrencyCache.Get(symbol);
        }

        public static void CleanCache()
        {
            CurrencyCache.Clear();
        }

    }
}