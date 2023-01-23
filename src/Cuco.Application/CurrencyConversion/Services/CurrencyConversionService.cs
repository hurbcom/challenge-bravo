using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.GetCurrencyInUSD.Models;

namespace Cuco.Application.CurrencyConversion.Services;

internal class CurrencyConversionService : IService<CurrencyConversionInput, CurrencyConversionOutput>
{
    private const string SameCurrencyMessage = "The currencies are the same, therefore the amount doesn't change.";

    private const string CouldNotFindCurrenciesValueMessageBase =
        "Couldn't get the value in dollar from the currency with symbol: ";

    private readonly IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput> _getCurrencyInUsdService;

    public CurrencyConversionService(IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput> getCurrencyInUsdService)
    {
        _getCurrencyInUsdService = getCurrencyInUsdService;
    }

    public async Task<CurrencyConversionOutput> Handle(CurrencyConversionInput input)
    {
        if (CheckCurrenciesEquals(input))
            return GetOutput(input.Amount, SameCurrencyMessage);

        var (errorMessageGetValue, fromCurrencyInUsd, toCurrencyInUsd) = await GetCurrenciesValue(input);
        if (!string.IsNullOrEmpty(errorMessageGetValue))
            return GetOutput(null, errorMessageGetValue);

        var convertedValue = ConvertValue(fromCurrencyInUsd, toCurrencyInUsd, input.Amount);
        return GetOutput(convertedValue, $"Successfully converted from {input.FromCurrency} to {input.ToCurrency}");
    }

    private async Task<(string errorMessage, decimal fromCurrencyInUsd, decimal toCurrencyInUsd)> GetCurrenciesValue(
        CurrencyConversionInput input)
    {
        var errorMessage = string.Empty;

        var fromCurrencyResult =
            await _getCurrencyInUsdService.Handle(new GetCurrencyInUsdInput { Symbol = input.FromCurrency });
        if (fromCurrencyResult.ValueInDollar == 0)
            errorMessage += $"{CouldNotFindCurrenciesValueMessageBase}{input.FromCurrency}";

        var toCurrencyResult =
            await _getCurrencyInUsdService.Handle(new GetCurrencyInUsdInput { Symbol = input.ToCurrency });
        if (toCurrencyResult.ValueInDollar == 0)
            errorMessage += (errorMessage == string.Empty ? "" : "\n") +
                            $"{CouldNotFindCurrenciesValueMessageBase}{input.ToCurrency}";

        return (errorMessage, fromCurrencyResult.ValueInDollar, toCurrencyResult.ValueInDollar);
    }

    private static bool CheckCurrenciesEquals(CurrencyConversionInput input)
    {
        return string.Equals(input.FromCurrency, input.ToCurrency, StringComparison.OrdinalIgnoreCase);
    }

    private static decimal ConvertValue(decimal fromCurrencyInUsd, decimal toCurrencyInUsd, decimal amount)
    {
        return toCurrencyInUsd / fromCurrencyInUsd * amount;
    }

    private static CurrencyConversionOutput GetOutput(decimal? amount, string details)
    {
        return new()
        {
            ConvertedAmount = amount,
            Details = details
        };
    }
}