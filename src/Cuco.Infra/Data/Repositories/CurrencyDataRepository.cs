using Cuco.Domain.CurrenciesData.Models.Entities;
using Cuco.Domain.CurrenciesData.Services.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Cuco.Infra.Data.Repositories;

public class CurrencyDataRepository : ICurrencyDataRepository
{
    private readonly CucoDbContext Db;

    protected CurrencyDataRepository(CucoDbContext db)
    {
        Db = db;
    }

    public async Task InsertAsync(CurrencyData entity)
        => await Db.Set<CurrencyData>()
            .AddAsync(entity);

    public async Task<bool> ExistsBySymbolAsync(string symbol)
        => await Db.Set<CurrencyData>()
            .AnyAsync();

    public async Task<IList<CurrencyData>> GetAllAsync()
        => await Db.Set<CurrencyData>()
            .ToListAsync();

    public async Task<CurrencyData> GetBySymbolAsync(string symbol)
        => await Db.Set<CurrencyData>()
            .FirstOrDefaultAsync(e => e.Symbol == symbol);

    public async Task DeleteBySymbolASync(string symbol)
        => await Db.Set<CurrencyData>()
            .Where(e => e.Symbol == symbol)
            .ExecuteDeleteAsync();
}