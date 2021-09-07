using System;
using System.Threading.Tasks;

namespace CurrencyQuotation.Services.Interfaces
{
    public interface IRedisCacheService
    {
        Task<T> GetRedisCacheForConverter<T>(Func<T> func, string key, TimeSpan expireCache);
        Task<T> GetRedisCache<T>(Func<T> func, string key, TimeSpan expireCache);
    }
}
