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
        }
    }
}
