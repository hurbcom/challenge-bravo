using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.Data
{
    public interface ICurrencyRepository : IRepository<Currency>
    {
        Task<List<Currency>> GetByCodes(List<string> codes);
    }
}
