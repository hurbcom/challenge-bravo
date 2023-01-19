using Cuco.Domain.CurrenciesData.Models.Entities;

namespace Cuco.Domain.CurrenciesData.Services.Repositories;

public interface ICurrencyDataRepository
{
    Task InsertAsync(CurrencyData entity);
    Task<bool> ExistsBySymbolAsync(string symbol);
    Task<IList<CurrencyData>> GetAllAsync();
    Task<CurrencyData> GetBySymbolAsync(string symbol);
    Task DeleteBySymbolASync(string symbol);
}