using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace CurrencyConversion.Infra.Data;
public class CurrencyConversionDbContext : DbContext
{
    public CurrencyConversionDbContext(DbContextOptions<CurrencyConversionDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }
}