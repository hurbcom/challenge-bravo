using DesafioBravo.Models;
using Microsoft.EntityFrameworkCore;

namespace DesafioBravo.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public AppDbContext()
        {

        }

        public DbSet<Moeda> Moedas { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite(connectionString: "DataSource=app.db;Cache=Shared");
            }

        }

    }
}
