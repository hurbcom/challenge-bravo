using System.Text.Json.Serialization;

namespace CurrencyConverterAPI.Domain.Models
{
    public sealed class Error
    {
        public Error() { }

        public Error(int statusCode, string message)
        {
            StatusCode = statusCode;
            Message = message;
        }

        [JsonPropertyName("status_code")]
        public int StatusCode { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }

    }
}
