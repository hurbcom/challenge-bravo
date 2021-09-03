using CurrencyQuotation.Models;
using Microsoft.EntityFrameworkCore;

namespace CurrencyQuotation.DatabaseContext
{
    public class QuotationContext : DbContext
    {
        public QuotationContext(DbContextOptions<QuotationContext> options) : base(options)
        {
        }

        public DbSet<Currency> Currency { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Currency>()
                .Property(o => o.DolarAmount)
                .HasPrecision(22, 10);
        }
    }
}
