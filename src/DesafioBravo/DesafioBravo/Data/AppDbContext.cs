using DesafioBravo.BO;
using DesafioBravo.Models;
using Microsoft.EntityFrameworkCore;

namespace DesafioBravo.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Moeda> Moedas { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseSqlite(connectionString: "DataSource=app.db;Cache=Shared");

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);
        //    new MoedaBO(this).DadosIniciais(modelBuilder);
        //}
    }
}
