﻿using api_challenge_bravo.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.DependencyInjection;

namespace api_challenge_bravo.Util
{
    public class InitDB
    {
        public static void InsertDataDB(IApplicationBuilder app)
        {
            InsertDataDB(
                app.ApplicationServices.GetRequiredService<AppDbContext>());
        }
        public static void InsertDataDB(AppDbContext context)
        {
            context.Database.Migrate();
            if (!context.Currencies.Any())
            {
                context.Currencies.AddRange(
                    new Currency("BRL", "Real Brasileiro", 0.1984M, true),
                    new Currency("EUR", "Euro", 1.1086M, true),
                    new Currency("USD", "Dólar Americano", 1.0M, false),
                    new Currency("BTC", "Bitcoin", 40822.9M, true),
                    new Currency("ETH", "Ethereum", 2817.54M, true)
                );
                context.SaveChanges();
            } else {
                System.Console.WriteLine("Data already exists.");
            }
        }

    }
}