using System;
using System.Collections.Generic;

namespace api_challenge_bravo.Model
{
    public class Currency
    {
        // Using for Mock testing, remove after DB configuration
        public static List<Currency> Currencies = new List<Currency>();

        public int Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }
        public float ExchangeRateInUSD { get; set; }
        public bool AutoUpdateExchangeRate { get; set; }
        public DateTime? LastTimeUpdatedExchangeRate { get; set; }

        public Currency()
        {

        }
        public Currency(string symbol, string name, float exchangeRateInUSD, bool autoUpdateExchangeRate)
        {
            this.Symbol = symbol;
            this.Name = name;
            this.ExchangeRateInUSD = exchangeRateInUSD;
            this.AutoUpdateExchangeRate = autoUpdateExchangeRate;

            Currencies.Add(this);
        }

        public static List<Currency> GetAll()
        {
            return Currencies;
        }

        public static Currency Get(string symbol)
        {
            return Currencies.Find(x => x.Symbol == symbol);
        }

        public static bool Delete(string symbol)
        {
            return Currencies.Remove(Get(symbol));
        }
    }
}