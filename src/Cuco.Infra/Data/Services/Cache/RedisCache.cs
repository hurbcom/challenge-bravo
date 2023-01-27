using Cuco.Commons.Base;
using StackExchange.Redis;

namespace Cuco.Infra.Data.Services.Cache;

public class RedisCache : IRedisCache
{
    private const string UniversalLockString = "_uLock";

    private readonly ILockingService _lockingService;
    private readonly IConnectionMultiplexer _redis;

    public RedisCache(ILockingService lockingService, IConnectionMultiplexer redis)
    {
        _lockingService = lockingService;
        _redis = redis;
    }

    public async Task<string> GetAsync(string key)
    {
        try
        {
            if (await _lockingService.IsLockedAsync(key) ||
                await _lockingService.IsLockedAsync(UniversalLockString))
                return null;
            return await _redis.GetDatabase().StringGetAsync(key);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }

    public Task<bool> ExistsAsync(string key)
    {
        return _redis.GetDatabase().KeyExistsAsync(key);
    }

    public Task SetAsync(string key, string value)
    {
        return SetWithLock(key, Task() => _redis.GetDatabase().StringSetAsync(key, value));
    }

    public Task MultipleSetAsync<TValue>(IDictionary<string, TValue> newValues)
    {
        return SetWithLock(UniversalLockString, async () =>
        {
            foreach (var key in newValues.Keys)
                await _redis.GetDatabase().StringSetAsync(key, newValues[key].ToString() ?? string.Empty);
        });
    }

    private async Task SetWithLock(string key, Func<Task> action)
    {
        if (!await _lockingService.GetLockAsync(key))
            return;

        try
        {
            await action();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
        finally
        {
            await _lockingService.ReleaseLockAsync(key);
        }
    }
}