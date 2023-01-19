using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Cuco.Infra.Data.Repositories;

public class CurrencyRepository : ICurrencyRepository
{
    private readonly DbSet<Currency> _currencies;

    protected CurrencyRepository(CucoDbContext db)
    {
        _currencies = db.Set<Currency>();
    }

    public async Task InsertAsync(Currency entity)
        => await _currencies.AddAsync(entity);

    public async Task<bool> ExistsBySymbolAsync(string symbol)
        => await _currencies.AnyAsync();

    public async Task<IList<Currency>> GetAllAsync()
        => await _currencies.ToListAsync();

    public async Task<Currency> GetBySymbolAsync(string symbol)
        => await _currencies.FirstOrDefaultAsync(c => c.Symbol == symbol);

    public async Task DeleteBySymbolASync(string symbol)
        => await _currencies.Where(e => e.Symbol == symbol)
                            .ExecuteDeleteAsync();
}