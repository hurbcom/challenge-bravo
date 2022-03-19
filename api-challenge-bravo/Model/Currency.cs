using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using api_challenge_bravo.Model.Util;

// Allowing UnitTests to access Internal Props
[assembly: InternalsVisibleTo("tests-challenge-bravo")]

namespace api_challenge_bravo.Model
{
    public class Currency
    {
        static int countDBCalls = 1;

        [Key]
        public string Symbol { get; set; }
        public string Name { get; set; }
        public decimal ExchangeRateInUSD { get; set; }
        public bool AutoUpdateExchangeRate { get; set; }
        public DateTime LastTimeUpdatedExchangeRate { get; set; }

        public Currency()
        {

        }
        public Currency(string symbol, string name, decimal exchangeRateInUSD, bool autoUpdateExchangeRate, DateTime lastTimeUpdatedExchangeRate)
        {
            this.Symbol = symbol.ToUpper();
            this.Name = name;
            this.ExchangeRateInUSD = exchangeRateInUSD;
            this.AutoUpdateExchangeRate = autoUpdateExchangeRate;
            this.LastTimeUpdatedExchangeRate = lastTimeUpdatedExchangeRate;

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
            Console.WriteLine("Calling DB: #" + countDBCalls++);
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
                DBCache.CleanCache();
            }
        }

        public static List<Currency> GetAllCached() => DBCache.GetAllCurrency();

        public static Currency GetCached(string symbol) => DBCache.GetCurrency(symbol);
    }
}