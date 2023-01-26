using System.Text.Json.Serialization;
using Cuco.Domain.Currencies.Models.DTOs;

namespace Cuco.Application.Contracts.Responses;

public class SaveCurrencyResponse
{
    [JsonPropertyName("was_saved")] public bool Result { get; init; }
    [JsonPropertyName("details")] public string Details { get; init; }
    [JsonPropertyName("currency")] public CurrencyDto Currency { get; init; }
}