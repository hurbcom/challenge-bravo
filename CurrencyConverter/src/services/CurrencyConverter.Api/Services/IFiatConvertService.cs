namespace CurrencyConverter.Api.Services
{
    public interface IFiatConvertService
    {
        double ConvertFiatToFiat(string from, string to, double amount);
    }
}