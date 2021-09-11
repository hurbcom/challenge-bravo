using CurrencyQuotation.Services.Interfaces;
using System;
using System.Threading;

namespace CurrencyQuotation.Utils
{
    public static class UtilitiesJob
    {
        public static void CheckRunningInAnotherAppContainer(IRedisCacheService redisCacheService, string keyCache)
        {
            string myContainerId = Environment.MachineName;
            redisCacheService.SetCacheValueAsync(keyCache, myContainerId, TimeSpan.FromMinutes(5)).GetAwaiter().GetResult();

            Thread.Sleep(3000);

            string containerRunningJob = redisCacheService.GetCacheValueStringAsync(keyCache).Result;

            if (!string.IsNullOrEmpty(containerRunningJob) && containerRunningJob != myContainerId)
            {
                throw new AggregateException("Em execução em outra intância da aplicação");
            }
        }
    }
}
