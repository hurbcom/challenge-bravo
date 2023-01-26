using System.Text.Json.Serialization;

namespace Cuco.Domain.Currencies.Models.DTOs;

public class CurrencyDto
{
    [JsonPropertyName("symbol")] public string Symbol { get; init; }
    [JsonPropertyName("name")] public string Name { get; init; }
    [JsonPropertyName("value_in_dollar")] public decimal ValueInDollar { get; init; }
    [JsonPropertyName("last_update_at")] public DateTime? LastUpdateAt { get; init; }
    [JsonPropertyName("is_available")] public bool Available { get; init; }
}