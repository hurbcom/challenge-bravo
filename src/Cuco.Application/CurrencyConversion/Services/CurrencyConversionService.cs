using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.GetCurrencyInUSD.Models;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.CurrencyConversion.Services;
internal class CurrencyConversionService : IService<CurrencyConversionInput, CurrencyConversionOutput>
{
    private const string SameCurrencyMessage = "The currencies are the same, therefore the amount doesn't change.";
    private const string CouldNotFindCurrenciesValueMessageBase = "Couldn't get the value in dollar from the currency with symbol: ";
    private const string CouldNotFindCurrenciesMessageBase = "Couldn't find the currency with symbol: ";

    private readonly IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput> _getCurrencyInUsdService;
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyConversionService(IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput> getCurrencyInUsdService,
        ICurrencyRepository currencyRepository)
    {
        _getCurrencyInUsdService = getCurrencyInUsdService;
        _currencyRepository = currencyRepository;
    }

    public async Task<CurrencyConversionOutput> Handle(CurrencyConversionInput input)
    {
        var errorMessageCurrencyExist = await CheckCurrenciesExist(input);
        if (!string.IsNullOrEmpty(errorMessageCurrencyExist))
            return GetOutput(null, errorMessageCurrencyExist);

        if (CheckCurrenciesEquals(input))
            return GetOutput(input.Amount, SameCurrencyMessage);

        var (errorMessageGetValue, fromCurrencyInUsd, toCurrencyInUsd) = await GetCurrenciesValue(input);
        if (!string.IsNullOrEmpty(errorMessageGetValue))
            return GetOutput(null, errorMessageGetValue);

        var convertedValue = ConvertValue(fromCurrencyInUsd, toCurrencyInUsd, input.Amount);
        return GetOutput(convertedValue, $"Successfully converted from {input.FromCurrency} to {input.ToCurrency}");
    }

    private async Task<(string errorMessage, decimal fromCurrencyInUsd, decimal toCurrencyInUsd)> GetCurrenciesValue(CurrencyConversionInput input)
    {
        var errorMessage = string.Empty;

        var fromCurrencyResult = await _getCurrencyInUsdService.Handle(new() { Symbol = input.FromCurrency});
        if (fromCurrencyResult.ValueInDollar == 0)
            errorMessage += $"{CouldNotFindCurrenciesValueMessageBase}{input.FromCurrency}";

        var toCurrencyResult = await _getCurrencyInUsdService.Handle(new() { Symbol = input.ToCurrency});
        if (toCurrencyResult.ValueInDollar == 0)
            errorMessage += (errorMessage == string.Empty ? "" : "\n") +
                            $"{CouldNotFindCurrenciesValueMessageBase}{input.ToCurrency}";

        return (errorMessage, fromCurrencyResult.ValueInDollar, toCurrencyResult.ValueInDollar);
    }

    private async Task<string> CheckCurrenciesExist(CurrencyConversionInput input)
    {
        var errorMessage = string.Empty;
        if (!await _currencyRepository.ExistsBySymbolAsync(input.FromCurrency))
            errorMessage += $"{CouldNotFindCurrenciesMessageBase}{input.FromCurrency}";

        if (!await _currencyRepository.ExistsBySymbolAsync(input.ToCurrency))
            errorMessage += (errorMessage == string.Empty ? "" : "\n") +
                            $"{CouldNotFindCurrenciesMessageBase}{input.ToCurrency}";

        return errorMessage;
    }

    private static bool CheckCurrenciesEquals(CurrencyConversionInput input)
        => string.Equals(input.FromCurrency, input.ToCurrency, StringComparison.OrdinalIgnoreCase);

    private static decimal ConvertValue(decimal fromCurrencyInUsd, decimal toCurrencyInUsd, decimal amount)
        => (toCurrencyInUsd / fromCurrencyInUsd) * amount;

    private static CurrencyConversionOutput GetOutput(decimal? amount, string details)
        => new()
        {
            ConvertedAmount = amount,
            Details = details
        };
}
