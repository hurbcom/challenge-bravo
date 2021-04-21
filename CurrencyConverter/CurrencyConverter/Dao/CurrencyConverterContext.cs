using CurrencyConverter.Model;
using Microsoft.EntityFrameworkCore;

namespace CurrencyConverter.Dao
{
    public class CurrencyConverterContext : DbContext
    {
        public CurrencyConverterContext(DbContextOptions<CurrencyConverterContext> options) : base(options)
        {
            //Empty Constructor
        }

        public DbSet<Currency> Currency { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Currency>().HasData(
                new Currency(1, "USD", 1.00),
                new Currency(2, "BRL", 6.00),
                new Currency(3, "EUR", 0.50),
                new Currency(4, "BTC", 100000.00),
                new Currency(5, "ETH", 20000.00)
            );
        }
    }
}
