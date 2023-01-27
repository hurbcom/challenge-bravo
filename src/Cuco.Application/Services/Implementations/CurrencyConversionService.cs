using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Resources;
using Microsoft.AspNetCore.Http;

namespace Cuco.Application.Services.Implementations;

public class CurrencyConversionService : ICurrencyConversionService
{
    private readonly IGetDollarValueService _getDollarValueService;

    public CurrencyConversionService(IGetDollarValueService getDollarValueService)
    {
        _getDollarValueService = getDollarValueService;
    }

    public async Task<CurrencyConversionResponse> ConvertCurrency(CurrencyConversionRequest request)
    {
        try
        {
            var validationErrors = ValidateRequest(request);
            if (!string.IsNullOrEmpty(validationErrors))
                return GetResponse(null, validationErrors, StatusCodes.Status400BadRequest);
            if (CheckCurrenciesEquals(request))
                return GetResponse(request.Amount, DetailsResources.SameCurrencyMessage, StatusCodes.Status200OK);

            var convertedValues = await _getDollarValueService.Convert(new[] {request.FromCurrency, request.ToCurrency});
            if (convertedValues.Length < 2 || convertedValues[0] == 0 || convertedValues[1] == 0)
                return GetResponse(null, ErrorResources.FailedToConvertCurrenciesToDollar, StatusCodes.Status503ServiceUnavailable);

            var convertedValue = ConvertValue(convertedValues[0], convertedValues[1], request.Amount);
            return GetResponse(convertedValue, request.FromCurrency.SuccessfullyConverted(request.ToCurrency), StatusCodes.Status200OK);
        }
        catch
        {
            return GetResponse(null, ErrorResources.UnexpectedErrorOccurred, StatusCodes.Status500InternalServerError);
        }
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

    private static string ValidateRequest(CurrencyConversionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FromCurrency) || string.IsNullOrWhiteSpace(request.ToCurrency))
            return ErrorResources.CannotConvertFromAEmptySymbol;
        if (request.FromCurrency.Length is > 10 or < 3 || request.ToCurrency.Length is > 10 or < 3)
            return ErrorResources.SymbolLength;
        return string.Empty;
    }

    private static CurrencyConversionResponse GetResponse(decimal? amount, string details, int statusCode)
    {
        return new CurrencyConversionResponse
        {
            ConvertedAmount = amount,
            Details = details,
            StatusCode = statusCode
        };
    }
}