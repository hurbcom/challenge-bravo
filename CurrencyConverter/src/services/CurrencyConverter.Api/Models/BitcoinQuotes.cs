using System.Text.Json.Serialization;

namespace CurrencyConverter.Api.Models
{
    public class BitcoinQuotes
    {
        [JsonPropertyName("data")]
        public Data Data { get; set; }
    }

    public abstract class CurrencyQuote
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("symbol")]
        public string Symbol { get; set; }

        [JsonPropertyName("quotes")]
        public Quotes Quotes { get; set; }
    }

    public class _1 : CurrencyQuote { }

    public class _1027 : CurrencyQuote { }

    public class Data
    {
        [JsonPropertyName("1")]
        public _1 _1 { get; set; }

        [JsonPropertyName("1027")]
        public _1027 _1027 { get; set; }
    }

    public class Quotes
    {
        [JsonPropertyName("USD")]
        public USD USD { get; set; }
    }


    public class USD
    {
        [JsonPropertyName("price")]
        public double Price { get; set; }
    }
}
