using Microsoft.Extensions.Caching.Distributed;

namespace Cuco.Application.Tests;

public class RedisPing : IRedisPing
{
    private readonly IDistributedCache _cache;
    private readonly DistributedCacheEntryOptions _redisOptions;

    public RedisPing(IDistributedCache cache)
    {
        _cache = cache;
        _redisOptions = new()
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(45)
        };
    }

    public async Task AddPong()
        => await _cache.SetStringAsync("ping", "pong", _redisOptions);
    public async Task<string> Ping()
        => await _cache?.GetStringAsync("ping");
}