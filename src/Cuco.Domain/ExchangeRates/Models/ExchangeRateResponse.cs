using System.Text.Json.Serialization;

namespace Cuco.Domain.ExchangeRates.Models;

public class ExchangeRateResponse
{
    [JsonPropertyName("timestamp")]
    public long UnixTimestamp { get; set; }

    [JsonPropertyName("rates")]
    public Dictionary<string, decimal> Rates { get; set; }
}