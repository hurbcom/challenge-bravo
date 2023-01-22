using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Models.Entities;

namespace Cuco.Domain.Currencies.Services.Repositories;

public interface ICurrencyRepository : IRepository<Currency>
{
    Task<bool> ExistsBySymbolAsync(string symbol);
    Task<Currency> GetBySymbolAsync(string symbol);
    Task<bool> DeleteBySymbolASync(string symbol);
    Task<bool> IsAvailableAsync(string symbol);
    Task<IList<Currency>> GetAllAvailableAsync();
}