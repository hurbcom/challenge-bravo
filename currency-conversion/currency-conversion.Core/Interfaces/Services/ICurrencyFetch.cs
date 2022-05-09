using currency_conversion.Core.Models;

namespace currency_conversion.Core.Interfaces.Services
{
    public interface ICurrencyFetch
    {
        public Task UpdateCurrenciesAsync();

        public Task<Currency?> FetchCurrencyAsync(string code);
    }
}
