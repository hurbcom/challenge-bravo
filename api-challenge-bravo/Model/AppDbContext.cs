using System;
using System.Threading;
using Microsoft.EntityFrameworkCore;

namespace api_challenge_bravo.Model
{
    public class AppDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var host = System.Diagnostics.Debugger.IsAttached ? "localhost" : "bd_MySQL";
            optionsBuilder
                .UseMySql(@$"Server={host};Database=currencydb;Uid=root;Pwd=dbdevpassword;");
        }
        public DbSet<Currency> Currencies { get; set; }

    }
}