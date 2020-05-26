using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CurrencyConverter.Infrasctructure
{
    public static class DatabaseInitialSeed
    {
        public static bool EnsureSeedDataForContext(this DatabaseContext context)
        {
            if (context.Currencies.Any()) return false;

            //initial currencies

            var result = context.SaveChanges();
            return true;
        }
    }
}
