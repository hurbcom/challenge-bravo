using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Cuco.Infra.Data.Repositories;

public class CurrencyRepository : Repository<Currency>, ICurrencyRepository
{
    public CurrencyRepository(CucoDbContext db) : base(db)
    {
    }

    public async Task InsertAsync(Currency entity)
        => await Db.Set<Currency>()
            .AddAsync(entity);

    public async Task<bool> ExistsBySymbolAsync(string symbol)
        => await Db.Set<Currency>()
            .AnyAsync();

    public async Task<Currency> GetBySymbolAsync(string symbol)
        => await Db.Set<Currency>()
            .FirstOrDefaultAsync(c => c.Symbol == symbol);

    public async Task DeleteBySymbolASync(string symbol)
        => await Db.Set<Currency>()
            .Where(c => c.Symbol == symbol)
            .ExecuteDeleteAsync();

    public async Task<bool> IsAvailableAsync(string symbol)
        => await Db.Set<Currency>()
            .AnyAsync(c => c.Symbol == symbol && c.Available);

    public async Task<IList<Currency>> GetAllAvailableAsync()
        => await Db.Set<Currency>()
            .Where(c => c.Available)
            .ToListAsync();
}