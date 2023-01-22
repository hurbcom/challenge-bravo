namespace Cuco.Application.GetCurrencyValueFromCache;

public interface ICurrencyValueHelper
{
    Task<bool> IsReal(string symbol);
    Task<decimal> ValueInDollar(string symbol);
    Task SetImaginaryCurrencyValue(string symbol, decimal value);
}