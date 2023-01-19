namespace Cuco.Application.CurrencyConversion;
public interface ICurrencyConversionService
{
    Task<decimal> ConvertCurrency(string fromCurrency, string toCurrency, decimal value);
}
