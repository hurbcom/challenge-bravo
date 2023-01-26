using System.Text.Json.Serialization;

namespace Cuco.Application.Contracts.Responses;

public class SyncCurrenciesResponse
{
    [JsonPropertyName("result")] public bool Result { get; init; }
    [JsonPropertyName("timestamp")] public long Timestamp { get; init; }
    [JsonPropertyName("details")] public string Details { get; init; }
}