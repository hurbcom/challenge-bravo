using currency_conversion.Core.Models;
using EntityFramework.Exceptions.PostgreSQL;
using Microsoft.EntityFrameworkCore;

namespace currency_conversion.infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Currency> Currency => Set<Currency>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseExceptionProcessor();
        }
    }
}
