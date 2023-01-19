using Cuco.Application.GetCurrencyInUSD;

namespace Cuco.Application.CurrencyConversion;
internal class CurrencyConversionService : ICurrencyConversionService
{
    private readonly IGetCurrencyInUSDService _getCurrencyInUSDService;
    public async Task<decimal> ConvertCurrency(string fromCurrency, string toCurrency, decimal amount)
    {
        if (string.Equals(fromCurrency, toCurrency, StringComparison.OrdinalIgnoreCase)) return amount;

        if (await _getCurrencyInUSDService.GetCurrencyInUSDAsync(fromCurrency) is not { } fromCurrencyInUSD
            || await _getCurrencyInUSDService.GetCurrencyInUSDAsync(toCurrency) is not { } toCurrencyInUSD)
            return 0;

        return ConvertValue(fromCurrencyInUSD, toCurrencyInUSD, amount);
    }

    private decimal ConvertValue(decimal fromCurrencyInUSD, decimal toCurrencyInUSD, decimal amount)
        => (toCurrencyInUSD / fromCurrencyInUSD) * amount;
}
