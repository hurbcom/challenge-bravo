using System;
using System.Threading;
using Microsoft.EntityFrameworkCore;

namespace api_challenge_bravo.Model
{
    public class AppDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseMySql(@"Server=localhost;Database=currencydb;Uid=root;Pwd=dbdevpassword;");
        }
        public DbSet<Currency> Currencies { get; set; }

    }
}