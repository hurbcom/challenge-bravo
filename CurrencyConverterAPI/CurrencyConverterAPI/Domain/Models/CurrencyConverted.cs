using System.Text.Json.Serialization;

namespace CurrencyConverterAPI.Domain.Models
{
    public sealed class CurrencyConverted
    {
        public CurrencyConverted(string from, string to, decimal amount, decimal amountConverted)
        {
            From = from;
            To = to;
            Amount = amount;
            AmountConverted = amountConverted;
        }

        [JsonPropertyName("from")]
        public string From { get; set; }

        [JsonPropertyName("to")]
        public string To { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("amount_converted")]
        public decimal AmountConverted { get; set; }
    }
}
