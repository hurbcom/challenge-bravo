using System;
using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.DependencyInjection;

namespace api_challenge_bravo.Model.Util
{
    public class InitDB
    {
        public static void InsertDataDB(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                InsertDataDB(
                    serviceScope.ServiceProvider.GetRequiredService<AppDbContext>());
            }
        }
        public static void InsertDataDB(AppDbContext context)
        {
            context.Database.Migrate();
            if (!context.Currencies.Any())
            {
                CultureInfo usCulture = new CultureInfo("en-US", false);
                context.Currencies.AddRange(
                    new Currency("BRL", "Real Brasileiro", 0.199M, true,DateTime.Parse("2022-03-18 17:59:56",usCulture)),
                    new Currency("EUR", "Euro", 1.1049M, true,DateTime.Parse("2022-03-18 17:59:53",usCulture)),
                    new Currency("USD", "Dólar Americano", 1.0M, false,DateTime.Parse("2022-03-18 17:59:56",usCulture)),
                    new Currency("BTC", "Bitcoin", 41801.9M, true,DateTime.Parse("2022-03-19 10:07:34",usCulture)),
                    new Currency("ETH", "Ethereum", 2966.86M, true,DateTime.Parse("2022-03-19 10:07:0",usCulture))
                );
            } else {
                System.Console.WriteLine("Data already exists.");
            }
        }
    }
}