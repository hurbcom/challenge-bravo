using Cuco.Commons.Base;
using Microsoft.Extensions.Caching.Distributed;

namespace Cuco.Infra.Data;

public class RedisCache : ICache
{
    private readonly IDistributedCache _cache;

    public RedisCache(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<string> GetAsync(string key)
        => await _cache.GetStringAsync(key);

    public async Task SetAsync(string key, string value)
        => await _cache.SetStringAsync(key, value);

    public async Task RemoveAsync(string key)
        => await _cache.RemoveAsync(key);

    public async Task<bool> ExistsAsync(string key)
        => await _cache.GetAsync(key) is not null;
}