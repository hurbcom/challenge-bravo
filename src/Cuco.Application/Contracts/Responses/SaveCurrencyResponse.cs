using System.Text.Json.Serialization;
using Cuco.Domain.Currencies.Models.DTOs;

namespace Cuco.Application.Contracts.Responses;

public class SaveCurrencyResponse
{
    [JsonPropertyName("was_saved")] public bool Result { get; set; }
    [JsonPropertyName("details")] public string Details { get; set; }
    [JsonPropertyName("currency")] public CurrencyDto Currency { get; init; }
}