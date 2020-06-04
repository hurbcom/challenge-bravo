using CurrencyConverter.Infrasctructure.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Threading.Tasks;

namespace CurrencyConverter.Infrasctructure.Repositories
{
    public class CacheBase : ICacheBase
    {
        private readonly IDistributedCache _cache;

        public CacheBase(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task<string> GetAsync(string key)
        {
            return await _cache.GetStringAsync(key);
        }

        public async Task<bool> RemoveAsync(string key)
        {
            try
            {
                await _cache.RemoveAsync(key);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> SetAsync(string key, string value)
        {
            try
            {
                await _cache.SetStringAsync(key, value);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
