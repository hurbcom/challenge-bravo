using System.Text.Json.Serialization;
using Cuco.Commons.Base;

namespace Cuco.Application.Contracts.Responses;

public class CurrencyConversionResponse : Response
{
    [JsonPropertyName("converted_amount")] public decimal? ConvertedAmount { get; init; }
}