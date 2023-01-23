using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Cuco.Infra.Data.Repositories;

public class CurrencyRepository : Repository<Currency>, ICurrencyRepository
{
    public CurrencyRepository(CucoDbContext db) : base(db)
    {
    }

    public async Task<bool> ExistsBySymbolAsync(string symbol)
        => await Db.Set<Currency>()
            .AnyAsync(c => c.Symbol.ToUpper() == symbol.ToUpper());

    public async Task<Currency> GetBySymbolAsync(string symbol)
        => await Db.Set<Currency>()
            .FirstOrDefaultAsync(c => c.Symbol == symbol);

    public async Task<bool> DeleteBySymbolASync(string symbol)
        => await Db.Set<Currency>()
            .Where(c => c.Symbol == symbol)
            .ExecuteDeleteAsync() == 1;

    public async Task<Currency> GetBySymbolAsNoTrackingAsync(string symbol)
        => await Db.Set<Currency>()
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Symbol == symbol);
}