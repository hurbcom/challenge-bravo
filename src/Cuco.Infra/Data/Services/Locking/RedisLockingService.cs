using Cuco.Commons.Base;
using StackExchange.Redis;

namespace Cuco.Infra.Data.Services.Locking;

public class RedisLockingService : ILockingService
{
    private const string LockPrefix = "_distributed_lock";
    private static readonly TimeSpan LockExpiry = TimeSpan.FromSeconds(1);

    private readonly IConnectionMultiplexer _redis;

    public RedisLockingService(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<bool> IsLockedAsync(string key)
    {
        return (await _redis.GetDatabase().LockQueryAsync(AddLockPrefix(key))).HasValue;
    }

    public Task<bool> GetLockAsync(string key)
    {
        try
        {
            return _redis.GetDatabase().LockTakeAsync(
                AddLockPrefix(key),
                Environment.MachineName,
                LockExpiry);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }

    public Task ReleaseLockAsync(string key)
    {
        return _redis.GetDatabase().LockReleaseAsync(AddLockPrefix(key), Environment.MachineName);
    }

    private static string AddLockPrefix(string key)
    {
        return key + LockPrefix;
    }
}