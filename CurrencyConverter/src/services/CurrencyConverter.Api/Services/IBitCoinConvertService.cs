using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.Services
{
    public interface IBitCoinConvertService
    {
        Task<double> ConvertBitCoin(string from, string to, double amount, List<Currency> fictionsCurrencies);
        Task<double> ConvertBitCoinToFiat(string from, string to, double amount);
        Task<double> ConvertFiatToBitCoin(string from, string to, double amount);
        Task<double> ConvertFictionToBitCoin(double fictionValueInDollar, string to, double amount);
        Task<double> ConvertBitCoinToFiction(string from, double fictionValueInDollar, double amount);
    }
}
