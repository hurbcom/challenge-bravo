namespace CurrencyConversion.Application.UpdateCurrency;
public interface IUpdateCurrencyService
{
    Task<bool> UpdateCurrency(string currency, string baseCurrency, decimal newValue);
}
