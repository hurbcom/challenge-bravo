using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Cuco.Application.Contracts.Requests;

public class SaveCurrencyRequest
{
    [JsonPropertyName("name")]
    [StringLength(100, MinimumLength = 4)]
    public string Name { get; init; }

    [Required]
    [JsonPropertyName("symbol")]
    [StringLength(10, MinimumLength = 3)]
    public string Symbol { get; init; }

    [StringLength(10, MinimumLength = 0)]
    [JsonPropertyName("base_currency_symbol")]
    public string BaseCurrencySymbol { get; init; }

    // Vales in that range, with maximum two decimal values.
    [JsonPropertyName("value_in_base_currency")]
    [Range(0, 9999999999999999.99)]
    [RegularExpression(@"^\d+(\.\d{1,2})?$")]
    public decimal? ValueInBaseCurrency { get; init; }

    [JsonPropertyName("is_real")]
    public bool IsReal { get; init; }
}