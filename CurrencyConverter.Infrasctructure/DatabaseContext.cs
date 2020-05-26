using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using CurrencyConverter.Domain.Entities;

namespace CurrencyConverter.Infrastructure
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Configuration> configurations { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
