using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.GetCurrencyInUSD;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.CurrencyConversion.Services;
internal class CurrencyConversionService : IService<CurrencyConversionInput, CurrencyConversionOutput>
{
    private const string SameCurrencyMessage = "The currencies are the same, therefore the amount doesn't change.";
    private const string CouldntFindCurrenciesValueMessage = "Couldn't get the value in dollar from the currencies.";
    private const string CouldntFindCurrenciesMessageBase = "Couldn't find the currency with symbol: ";

    private readonly IGetCurrencyInUsdService _getCurrencyInUsdService;
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyConversionService(IGetCurrencyInUsdService getCurrencyInUsdService, ICurrencyRepository currencyRepository)
    {
        _getCurrencyInUsdService = getCurrencyInUsdService;
        _currencyRepository = currencyRepository;
    }

    public async Task<CurrencyConversionOutput> Handle(CurrencyConversionInput input)
    {
        var errorMessage = await CheckCurrenciesExist(input);
        if (!string.IsNullOrEmpty(errorMessage))
            return GetOutput(null, errorMessage);

        if (CheckCurrenciesEquals(input))
            return GetOutput(input.Amount, SameCurrencyMessage);

        var fromCurrencyInUsd = await _getCurrencyInUsdService.GetCurrencyInUsdAsync(input.FromCurrency) ?? 0;
        var toCurrencyInUsd = await _getCurrencyInUsdService.GetCurrencyInUsdAsync(input.ToCurrency) ?? 0;
        if (fromCurrencyInUsd == 0 || toCurrencyInUsd == 0)
            return GetOutput(null, CouldntFindCurrenciesValueMessage);

        var convertedValue = ConvertValue(fromCurrencyInUsd, toCurrencyInUsd, input.Amount);
        return GetOutput(convertedValue, $"Successfully converted from {input.FromCurrency} to {input.ToCurrency}");
    }

    private async Task<string> CheckCurrenciesExist(CurrencyConversionInput input)
    {
        var errorMessage = string.Empty;
        if (!await _currencyRepository.ExistsBySymbolAsync(input.FromCurrency))
            errorMessage += $"{CouldntFindCurrenciesMessageBase}{input.FromCurrency}";

        if (!await _currencyRepository.ExistsBySymbolAsync(input.ToCurrency))
            errorMessage += (errorMessage == string.Empty ? "" : "\n") +
                            $"{CouldntFindCurrenciesMessageBase}{input.ToCurrency}";

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
