using System.Text.Json.Serialization;

namespace Cuco.Application.OpenExchangeRate.Models;

public class ExchangeRateResponse
{
    [JsonPropertyName("timestamp")] public long Timestamp { get; set; }

    [JsonPropertyName("rates")] public Dictionary<string, decimal> Rates { get; set; }
}