namespace Cuco.Commons.Base;

public interface IRedisCache
{
    Task<string> GetAsync(string key);
    Task SetAsync(string key, string value);
    Task MultipleSetAsync<TValue>(IDictionary<string, TValue> newValues);
    Task<bool> ExistsAsync(string key);
}