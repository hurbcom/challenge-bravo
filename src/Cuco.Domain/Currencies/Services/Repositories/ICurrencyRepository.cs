using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Models.DTOs;
using Cuco.Domain.Currencies.Models.Entities;

namespace Cuco.Domain.Currencies.Services.Repositories;

public interface ICurrencyRepository : IRepository<Currency>
{
    Task<bool> ExistsBySymbolAsync(string symbol);
    Task<Currency> GetBySymbolAsync(string symbol);
    Task<bool> DeleteBySymbolAsync(string symbol);
    Task<Currency> GetBySymbolAsNoTrackingAsync(string symbol);
    Task<IEnumerable<CurrencyDto>> GetAllDtoAsync();
}