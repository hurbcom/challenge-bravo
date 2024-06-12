using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.Services
{
    public interface IFictionCurrencyService
    {
        Task<List<Currency>> GetFictionsCurrencies(List<string> codes);
        Task<double> ConvertFictionCurrency(string from, string to, double amount, List<Currency> fictionsCurrencies);
        Task<double> ConvertFictionToFiat(double fictionValueInDollar, string to, double amount);
        Task<double> ConvertFiatToFiction(string from, double fictionValueInDollar, double amount);
    }
}
