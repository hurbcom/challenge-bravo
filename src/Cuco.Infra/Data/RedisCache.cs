using Cuco.Commons.Base;
using Microsoft.Extensions.Caching.Distributed;

namespace Cuco.Infra.Data;

public class RedisCache : IRedisCache
{
    private readonly IDistributedCache _cache;
    private readonly ReaderWriterLockSlim _lock = new();

    public RedisCache(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<string> GetAsync(string key)
    {
        _lock.EnterReadLock();
        try
        {
            return await _cache.GetStringAsync(key);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }

    public async Task LockSetAsync(string key, string value)
        => await SetValueInCache(async () => await _cache.SetStringAsync(key, value));

    public async Task LockMultipleSetAsync<TValue>(IDictionary<string, TValue> newValues)
        => await SetValueInCache(async () =>
        {
            foreach (var key in newValues.Keys)
                await _cache.SetStringAsync(key, newValues[key].ToString() ?? string.Empty);
        });

    public async Task<bool> ExistsAsync(string key)
        => await _cache.GetAsync(key) is not null;

    private async Task SetValueInCache(Func<Task> setValueInCacheLogic)
    {
        if (!_lock.TryEnterWriteLock(TimeSpan.FromMilliseconds(20)))
        {
            Console.WriteLine("Couldn't acquire write lock!");
            return;
        }

        try
        {
            await setValueInCacheLogic();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
        finally
        {
            if (_lock.IsWriteLockHeld)
                _lock.ExitWriteLock();
        }
    }
}