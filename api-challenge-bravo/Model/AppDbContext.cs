using Microsoft.EntityFrameworkCore;

namespace api_challenge_bravo.Model
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Currency> Currencies { get; set; }
    }
}