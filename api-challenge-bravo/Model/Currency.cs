using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Common;
using System.Linq;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;

// Allowing UnitTests to access Internal Props
[assembly: InternalsVisibleTo("tests-challenge-bravo")]

namespace api_challenge_bravo.Model
{
    public class Currency
    {
        [Key]
        public string Symbol { get; set; }
        public string Name { get; set; }
        public decimal ExchangeRateInUSD { get; set; }
        public bool AutoUpdateExchangeRate { get; set; }
        public DateTime? LastTimeUpdatedExchangeRate { get; set; }

        public Currency()
        {

        }
        public Currency(string symbol, string name, decimal exchangeRateInUSD, bool autoUpdateExchangeRate)
        {
            this.Symbol = symbol;
            this.Name = name;
            this.ExchangeRateInUSD = exchangeRateInUSD;
            this.AutoUpdateExchangeRate = autoUpdateExchangeRate;

            using (var DBcon = new AppDbContext())
            {
                DBcon.Currencies.Add(this);
                DBcon.SaveChanges();
            }
        }
        public static List<Currency> GetAll()
        {
            return new AppDbContext().Currencies.ToList();
        }
        public static Currency Get(string symbol)
        {
            return new AppDbContext().Currencies.FirstOrDefault(x => x.Symbol == symbol);
        }
        public static void Delete(string symbol)
        {
            using (var DBcon = new AppDbContext())
            {
                DBcon.Currencies.Remove(Get(symbol));
                DBcon.SaveChanges();
            }
        }
        public void UpdateExchangeRate(decimal newExchangeRat, DateTime dateTimeUpdate)
        {
            using (var DBcon = new AppDbContext())
            {
                this.ExchangeRateInUSD = newExchangeRat;
                this.LastTimeUpdatedExchangeRate = dateTimeUpdate;

                DBcon.Currencies.Update(this);
                DBcon.SaveChanges();
            }
        }
    }
}