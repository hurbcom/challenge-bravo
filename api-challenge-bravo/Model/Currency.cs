using System;

namespace api_challenge_bravo.Model
{
    public class Currency
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }
        public float ExchangeRateInUSD { get; set; }
        public bool AutoUpdateExchangeRate { get; set; }
        public DateTime? LastTimeUpdatedExchangeRate { get; set; }

        public Currency(string symbol, string name, float exchangeRateInUSD, bool autoUpdateExchangeRate)
        {
            this.Symbol = symbol;
            this.Name = name;
            this.ExchangeRateInUSD = exchangeRateInUSD;
            this.AutoUpdateExchangeRate = autoUpdateExchangeRate;
        }
    }
}