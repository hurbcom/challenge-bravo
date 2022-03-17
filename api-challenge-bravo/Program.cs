using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api_challenge_bravo.Model;
using api_challenge_bravo.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace api_challenge_bravo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Mock for testing propose, remove after DB config
            new Currency("BRL", "Real Brasileiro", 0.1948M, true);
            new Currency("EUR", "Euro", 1.0996M, true);
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}