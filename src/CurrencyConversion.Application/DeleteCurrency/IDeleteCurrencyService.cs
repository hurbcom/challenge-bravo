namespace CurrencyConversion.Application.DeleteCurrency;
public interface IDeleteCurrencyService
{
    Task<bool> DeleteCurrency(string currencyName);
}
