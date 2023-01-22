namespace Cuco.Commons.Base;

public interface IRedisCache
{
    Task<string> GetAsync(string key);
    Task LockSetAsync(string key, string value);
    Task LockMultipleSetAsync<TValue>(IDictionary<string, TValue> newValues);
    Task<bool> ExistsAsync(string key);
}