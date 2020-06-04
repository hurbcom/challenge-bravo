using System.Threading.Tasks;

namespace CurrencyConverter.Infrasctructure.Interfaces
{
    public interface ICacheBase
    {
        Task<bool> SetAsync(string key, string value);
        Task<string> GetAsync(string key);
        Task<bool> RemoveAsync(string key);
    }
}
