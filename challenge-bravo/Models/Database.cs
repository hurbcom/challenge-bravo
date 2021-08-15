using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace challenge_bravo.Models
{
    public class Database : DbContext
    {
        public Database():base("Database")
        {

        }

        public DbSet<Currency> Currencys { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Currency>().HasKey(c => c.Id);
            modelBuilder.Entity<Currency>().Property(c => c.Value).HasPrecision(18, 7);
        }

    }
}