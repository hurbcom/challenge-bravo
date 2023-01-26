using System.Text.Json.Serialization;

namespace Cuco.Application.Contracts.Responses;

public class ExchangeRateResponse
{
    [JsonPropertyName("timestamp")] public long Timestamp { get; init; }

    [JsonPropertyName("rates")] public Dictionary<string, decimal> Rates { get; init; }
}