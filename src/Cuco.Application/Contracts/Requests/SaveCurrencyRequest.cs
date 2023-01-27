using System.Text;
using System.Text.Json.Serialization;
using Cuco.Commons.Resources;

namespace Cuco.Application.Contracts.Requests;

public class SaveCurrencyRequest
{
    [JsonPropertyName("name")]
    public string Name { get; init; }

    [JsonPropertyName("symbol")]
    public string Symbol { get; init; }

    [JsonPropertyName("base_currency_symbol")]
    public string BaseCurrencySymbol { get; init; }

    [JsonPropertyName("value_in_base_currency")]
    public decimal? ValueInBaseCurrency { get; init; }

    [JsonPropertyName("is_real")]
    public bool IsReal { get; init; }

    public virtual string IsValid()
    {
        if (string.IsNullOrWhiteSpace(Symbol))
            return ErrorResources.SymbolMustExist;
        if (Symbol.Length is < 3 or > 10)
            return ErrorResources.SymbolLength;

        if (string.IsNullOrWhiteSpace(Name))
            return ErrorResources.CurrencyNameMustExist;
        if (Name.Length > 100)
            return ErrorResources.CurrencyNameLength;

        if (IsReal) return string.Empty;

        if (string.IsNullOrWhiteSpace(BaseCurrencySymbol))
            return ErrorResources.BaseCurrencyMustExistForSaving;
        if (BaseCurrencySymbol.Length is < 3 or > 10)
            return ErrorResources.SymbolLength;

        if (ValueInBaseCurrency <= 0)
            return ErrorResources.ValueInBaseCurrencyMustBeGreaterThanZero;

        return string.Empty;
    }
}