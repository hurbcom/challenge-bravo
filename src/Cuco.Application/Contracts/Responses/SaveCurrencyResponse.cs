using System.Text.Json.Serialization;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Models.DTOs;

namespace Cuco.Application.Contracts.Responses;

public class SaveCurrencyResponse : Response
{
    [JsonPropertyName("currency")] public CurrencyDto Currency { get; init; }
}