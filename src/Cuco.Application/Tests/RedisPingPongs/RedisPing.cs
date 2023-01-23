using Cuco.Commons.Base;

namespace Cuco.Application.Tests.RedisPingPongs;

public class RedisPing : IRedisPing
{
    private readonly IRedisCache _redisCache;

    public RedisPing(IRedisCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task<bool> AddPong()
    {
        try
        {
            await _redisCache.SetAsync("ping", "pong");
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }

    public async Task<string> Ping()
    {
        return await _redisCache.GetAsync("ping");
    }
}