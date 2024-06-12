using System.Text.Json.Serialization;

namespace CurrencyConverter.Core.Models
{
    public class CurrencyValues
    {
        public string Name { get; set; }

        [JsonPropertyName("symbol_native")]
        public string Symbol { get; set; }

        public string Code { get; set; }

        [JsonPropertyName("name_plural")]
        public string NamePlural { get; set; }

        public string Type { get; set; }

        [JsonPropertyName("quote_usd_price")]
        public double QuoteDollarPrice { get; set; }
    }
}
