using System.Text.Json.Serialization;

namespace CurrencyConverterAPI.Domain.Models
{
    public sealed class CurrencyConvertedResponse
    {
        public CurrencyConvertedResponse() { }

        public CurrencyConvertedResponse(int statusCode, Error? error)
        {
            StatusCode = statusCode;
            Error = error;
        }

        public CurrencyConvertedResponse(int statusCode, Error? error, CurrencyConverted? currencyConverted)
        {
            StatusCode = statusCode;
            Error = error;
            CurrencyConverted = currencyConverted;
        }

        [JsonPropertyName("status_code")]
        public int StatusCode { get; set; }

        [JsonPropertyName("error")]
        public Error? Error { get; set; }

        [JsonPropertyName("currency_converted")]
        public CurrencyConverted? CurrencyConverted { get; set; }
    }

    public sealed class Error
    {
        public Error(string message)
        {
            Message = message;
        }

        [JsonPropertyName("message")]
        public string Message { get; set; }
    }

    public class CurrencyConverted
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
