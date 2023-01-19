namespace Cuco.Application.DeleteCurrency;
public interface IDeleteCurrencyService
{
    Task<bool> DeleteCurrency(string currencyName);
}
