using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace api_challenge_bravo.Model.Util
{
    public class AppDbContext : DbContext
    {
        private static bool _isTestingInMemory = false;
        private static int _countDBCalls = 1;
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            Console.WriteLine("LOG: Calling DB: #" + _countDBCalls++);
            var host = System.Diagnostics.Debugger.IsAttached ? "localhost" : "db_MySQL";
            if (_isTestingInMemory)
                optionsBuilder
                    .UseInMemoryDatabase(@$"db_testing");
            else
                optionsBuilder
                    .UseMySql(@$"Server={host};Database=currencydb;Uid=root;Pwd=dbdevpassword;");
        }
        public DbSet<Currency> Currencies { get; set; }

        public static void SetTestingEnvironment()
        {
            _isTestingInMemory = true;
        }

    }
}