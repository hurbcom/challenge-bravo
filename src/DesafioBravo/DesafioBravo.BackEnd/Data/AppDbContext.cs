using DesafioBravoBackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Windows.Storage;

namespace DesafioBravoBackEnd.Data
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
