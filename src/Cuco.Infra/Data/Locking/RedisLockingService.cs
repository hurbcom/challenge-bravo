using System.Security.Cryptography;
using System.Text;
using Cuco.Commons.Base;
using StackExchange.Redis;

namespace Cuco.Infra.Data.Locking;

public class RedisLockingService : ILockingService
{
    private static readonly TimeSpan LockExpiry = TimeSpan.FromSeconds(1);

    private readonly IConnectionMultiplexer _redis;

    public RedisLockingService(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<bool> IsLockedAsync(string key)
        => (await _redis.GetDatabase().LockQueryAsync(key)).HasValue;

    public Task<bool> GetLockAsync(string key)
    {
        try
        {
            return _redis.GetDatabase().LockTakeAsync(
                GetHashKey(key),
                Environment.MachineName,
                LockExpiry);
        }
        catch (Exception e)
        {
            return Task.FromResult(false);
        }
    }

    public Task ReleaseLockAsync(string key)
        => _redis.GetDatabase().LockReleaseAsync(GetHashKey(key), Environment.MachineName);

    private static string GetHashKey(string key)
    {
        using var hasher = SHA1.Create();
        var bytes = Encoding.UTF8.GetBytes(key);
        var hash = hasher.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}