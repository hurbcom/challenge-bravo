using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using api_challenge_bravo.Model.Util;
using api_challenge_bravo.Services.Util;

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
        public DateTime LastTimeUpdatedExchangeRateUTC { get; set; }

        public Currency()
        {

        }
        public Currency(string symbol, string name, decimal exchangeRateInUSD, bool autoUpdateExchangeRate, DateTime lastTimeUpdatedExchangeRate)
        {
            var isAutoUpdatable = false;
            if (autoUpdateExchangeRate)
            {
                try
                {
                    isAutoUpdatable = ExternalAPI.CheckAvailabilityOfAutoUpdater(symbol);
                }
                catch (Exception)
                {
                    isAutoUpdatable = false;
                }
            }
            this.Symbol = symbol.ToUpper();
            this.Name = name;
            this.ExchangeRateInUSD = exchangeRateInUSD;
            this.AutoUpdateExchangeRate = isAutoUpdatable;
            this.LastTimeUpdatedExchangeRateUTC = lastTimeUpdatedExchangeRate.ToUniversalTime();

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
                this.LastTimeUpdatedExchangeRateUTC = dateTimeUpdate.ToUniversalTime() ;

                DBcon.Currencies.Update(this);
                DBcon.SaveChanges();
                DBCache.CleanCache();
            }
        }

        public static List<Currency> GetAllCached() => DBCache.GetAllCurrency();

        public static Currency GetCached(string symbol) => DBCache.GetCurrency(symbol);
    }
}