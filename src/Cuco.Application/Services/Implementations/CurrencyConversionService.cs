using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Resources;

namespace Cuco.Application.Services.Implementations;

public class CurrencyConversionService : ICurrencyConversionService
{
    private readonly IConvertToDollarService _convertToDollarService;

    public CurrencyConversionService(IConvertToDollarService convertToDollarService)
    {
        _convertToDollarService = convertToDollarService;
    }

    public async Task<CurrencyConversionResponse> ConvertCurrency(CurrencyConversionRequest request)
    {
        if (CheckCurrenciesEquals(request))
            return GetResponse(request.Amount, DetailsResources.SameCurrencyMessage);

        var convertedValues = await _convertToDollarService.Convert(new[] {request.FromCurrency, request.ToCurrency});
        if (convertedValues.Length < 2 || convertedValues[0] == 0 || convertedValues[1] == 0)
            return GetResponse(null, ErrorResources.FailedToConvertCurrenciesToDollar);

        var convertedValue = ConvertValue(convertedValues[0], convertedValues[1], request.Amount);
        return GetResponse(convertedValue, request.FromCurrency.SuccessfullyConverted(request.ToCurrency));
    }

    private static bool CheckCurrenciesEquals(CurrencyConversionRequest request)
    {
        return string.Equals(request.FromCurrency, request.ToCurrency, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Since both currencies are in the same base, you just need to check
    /// the rate of the exchange (to/from) and multiply by the value.
    /// </summary>
    /// <param name="fromCurrencyInUsd"></param>
    /// <param name="toCurrencyInUsd"></param>
    /// <param name="amount"></param>
    /// <returns></returns>
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