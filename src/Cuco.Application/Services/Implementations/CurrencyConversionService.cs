using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;

namespace Cuco.Application.Services.Implementations;

public class CurrencyConversionService : ICurrencyConversionService
{
    private const string SameCurrencyMessage = "The currencies are the same, therefore the amount doesn't change.";

    private const string CouldNotFindCurrenciesValueMessageBase = "Couldn't get the value in dollar from the currency with symbol: ";

    private readonly IConvertToDollarService _convertToDollarService;

    public CurrencyConversionService(IConvertToDollarService convertToDollarService)
    {
        _convertToDollarService = convertToDollarService;
    }

    public async Task<CurrencyConversionResponse> ConvertCurrency(CurrencyConversionRequest request)
    {
        if (CheckCurrenciesEquals(request))
            return GetResponse(request.Amount, SameCurrencyMessage);

        var (errorMessageGetValue, fromCurrencyInUsd, toCurrencyInUsd) = await GetCurrenciesValue(request);
        if (!string.IsNullOrEmpty(errorMessageGetValue))
            return GetResponse(null, errorMessageGetValue);

        var convertedValue = ConvertValue(fromCurrencyInUsd, toCurrencyInUsd, request.Amount);
        return GetResponse(convertedValue, $"Successfully converted from {request.FromCurrency} to {request.ToCurrency}");
    }

    private async Task<(string errorMessage, decimal fromCurrencyInUsd, decimal toCurrencyInUsd)> GetCurrenciesValue(
        CurrencyConversionRequest request)
    {
        var errorMessage = string.Empty;

        var convertedValues = await _convertToDollarService.Convert(new[] {request.FromCurrency, request.ToCurrency});
        if (convertedValues[0] == 0)
            errorMessage += $"{CouldNotFindCurrenciesValueMessageBase}{request.FromCurrency}";

        if (convertedValues[1] == 0)
            errorMessage += (errorMessage == string.Empty ? "" : "\n") +
                            $"{CouldNotFindCurrenciesValueMessageBase}{request.ToCurrency}";

        return (errorMessage, convertedValues[0], convertedValues[1]);
    }

    private static bool CheckCurrenciesEquals(CurrencyConversionRequest request)
    {
        return string.Equals(request.FromCurrency, request.ToCurrency, StringComparison.OrdinalIgnoreCase);
    }

    private static decimal ConvertValue(decimal fromCurrencyInUsd, decimal toCurrencyInUsd, decimal amount)
    {
        return toCurrencyInUsd * amount
               / fromCurrencyInUsd;
    }

    private static CurrencyConversionResponse GetResponse(decimal? amount, string details)
    {
        return new CurrencyConversionResponse
        {
            ConvertedAmount = amount,
            Details = details
        };
    }
}