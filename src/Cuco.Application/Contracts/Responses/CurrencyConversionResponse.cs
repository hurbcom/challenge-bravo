using System.Text.Json.Serialization;

namespace Cuco.Application.Contracts.Responses;

public class CurrencyConversionResponse
{
    [JsonPropertyName("converted_amount")] public decimal? ConvertedAmount { get; init; }
    [JsonPropertyName("details")] public string Details { get; init; }
}