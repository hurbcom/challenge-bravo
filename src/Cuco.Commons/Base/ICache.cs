namespace Cuco.Commons.Base;

public interface ICache
{
    Task<string> GetAsync(string key);
    Task SetAsync(string key, string value);
    Task RemoveAsync(string key);
    Task<bool> ExistsAsync(string key);
}