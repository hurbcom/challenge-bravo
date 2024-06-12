using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.Services
{
    public interface ICurrencyService
    {
        Task<double> ConvertCurrency(string from, string to, double amount);
        Task<List<CurrencyViewModel>> GetAsync();
        Task<List<CurrencyViewModel>> GetByCodesAsync(List<string> codes);
        Task<Currency> CreateAsync(CurrencyViewModel newCurrency);
        Task<CurrencyViewModel?> GetAsync(string id);
        Task UpdateAsync(string id, CurrencyViewModel updatedCurrency);
        Task RemoveAsync(string id);
    }
}
