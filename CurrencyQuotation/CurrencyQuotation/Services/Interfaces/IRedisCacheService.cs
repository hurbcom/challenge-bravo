using System;
using System.Threading.Tasks;

namespace CurrencyQuotation.Services.Interfaces
{
    public interface IRedisCacheService
    {
        Task<T> GetRedisCache<T>(Func<Task<T>> func, string key, TimeSpan expireCache);
    }
}
