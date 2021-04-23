using CurrencyConverter.Model;
using Microsoft.EntityFrameworkCore;
using System;

namespace CurrencyConverter.DBContexts
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
            modelBuilder.Entity<Currency>()
                .HasIndex(u => u.Name)
                .IsUnique();

            DateTime now = DateTime.Now;

            modelBuilder.Entity<Currency>()
                .Property(o => o.ValueComparedToBaseCurrency)
                .HasPrecision(22, 10);

            modelBuilder.Entity<Currency>()
                .HasData(
                new Currency(1, "USD", 1.00m, now, now),
                new Currency(2, "BRL", 5.4468m, now, now),
                new Currency(3, "EUR", 0.8324m, now, now),
                new Currency(4, "BTC", 0.0000180180m, now, now),
                new Currency(5, "ETH", 0.0003784925m, now, now)
            );
        }
    }
}
