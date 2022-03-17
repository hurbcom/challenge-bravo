using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

// Allowing UnitTests to acess Internal Props
[assembly: InternalsVisibleTo("tests-challenge-bravo")]

namespace api_challenge_bravo.Model
{
    public class Currency
    {
        // Using for Mock testing, remove after DB configuration
        public static List<Currency> Currencies = new List<Currency>();

        internal int Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }
        public decimal ExchangeRateInUSD { get; set; }
        public bool AutoUpdateExchangeRate { get; set; }
        internal DateTime? LastTimeUpdatedExchangeRate { get; set; }

        public Currency()
        {

        }
        public Currency(string symbol, string name, decimal exchangeRateInUSD, bool autoUpdateExchangeRate)
        {
            this.Symbol = symbol;
            this.Name = name;
            this.ExchangeRateInUSD = exchangeRateInUSD;
            this.AutoUpdateExchangeRate = autoUpdateExchangeRate;

            // Using for Mock testing, remove after DB configuration
            Currencies.Add(this);
        }
        public static List<Currency> GetAll()
        {
            // Using for Mock testing, remove after DB configuration
            return Currencies;
        }
        public static Currency Get(string symbol)
        {
            // Using for Mock testing, remove after DB configuration
            return Currencies.Find(x => x.Symbol == symbol);
        }
        public static bool Delete(string symbol)
        {
            // Using for Mock testing, remove after DB configuration
            return Currencies.Remove(Get(symbol));
        }

        public void UpdateExchangeRate(decimal newExchangeRat, DateTime dateTimeUpdate)
        {
            this.ExchangeRateInUSD = newExchangeRat;
            this.LastTimeUpdatedExchangeRate = dateTimeUpdate;

            // Using for Mock testing, remove after DB configuration
            var thisCurrency = Get(this.Symbol);
            thisCurrency = this;

            // Save ORM
        }
    }
}