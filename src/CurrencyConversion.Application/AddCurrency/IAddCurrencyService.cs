namespace CurrencyConversion.Application.AddCurrency;
public interface IAddCurrencyService
{
    Task<bool> AddCurrency(string name, string baseCurrency, decimal amount);
}
