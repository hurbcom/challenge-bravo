using Cuco.Domain.Currencies.Models.Entities;

namespace Cuco.Domain.Currencies.Services.Repositories;

public interface ICurrencyRepository
{
    Task InsertAsync(Currency entity);
    Task<bool> ExistsBySymbolAsync(string symbol);
    Task<IList<Currency>> GetAllAsync();
    Task<Currency> GetBySymbolAsync(string symbol);
    Task DeleteBySymbolASync(string symbol);
}