using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Cuco.Infra.Data.Services.Repositories;

public class CurrencyRepository : Repository<Currency>, ICurrencyRepository
{
    public CurrencyRepository(CucoDbContext db) : base(db)
    {
    }

    public async Task<bool> ExistsBySymbolAsync(string symbol)
    {
        return await Db.Set<Currency>()
            .AnyAsync(c => c.Symbol.ToUpper() == symbol.ToUpper());
    }

    public async Task<Currency> GetBySymbolAsync(string symbol)
    {
        return await Db.Set<Currency>()
            .FirstOrDefaultAsync(c => c.Symbol == symbol);
    }

    public async Task<bool> DeleteBySymbolASync(string symbol)
    {
        var currency = await GetBySymbolAsync(symbol);
        if (currency is null)
            return false;

        Db.Set<Currency>().Remove(currency);
        return true;
    }

    public async Task<Currency> GetBySymbolAsNoTrackingAsync(string symbol)
    {
        return await Db.Set<Currency>()
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Symbol == symbol);
    }
}