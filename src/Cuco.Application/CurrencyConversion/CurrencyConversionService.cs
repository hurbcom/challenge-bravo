namespace Cuco.Application.CurrencyConversion;
internal class CurrencyConversionService : ICurrencyConversionService
{
    public async Task<decimal> ConvertCurrency(string fromCurrency, string toCurrency, decimal value)
    {
        if (value <= 0) return 0;
        return 0;
    }
}
