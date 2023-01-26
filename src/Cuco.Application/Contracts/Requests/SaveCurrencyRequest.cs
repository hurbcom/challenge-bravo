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
        var builder = new StringBuilder();
        if (string.IsNullOrWhiteSpace(Name))
            builder.AppendLine(ErrorResources.CurrencyNameMustExist);
        else if (Name.Length > 100)
            builder.AppendLine(ErrorResources.CurrencyNameLength);

        if (string.IsNullOrWhiteSpace(Symbol))
            builder.AppendLine(ErrorResources.SymbolMustExist);
        else if (Symbol.Length is < 3 or > 10)
            builder.AppendLine(ErrorResources.SymbolLength);

        if (IsReal) return builder.ToString();

        if (string.IsNullOrWhiteSpace(BaseCurrencySymbol))
            builder.AppendLine(ErrorResources.BaseCurrencyMustExistForSaving);
        else if (BaseCurrencySymbol.Length is < 3 or > 10)
            builder.AppendLine(ErrorResources.SymbolLength);

        if (ValueInBaseCurrency <= 0)
            builder.AppendLine(ErrorResources.ValueInBaseCurrencyMustBeGreaterThanZero);
        return builder.ToString();
    }
}