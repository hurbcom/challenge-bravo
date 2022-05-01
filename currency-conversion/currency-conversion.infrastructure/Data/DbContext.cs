using currency_conversion.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace currency_conversion.infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Currency> Currency => Set<Currency>();
    }
}
