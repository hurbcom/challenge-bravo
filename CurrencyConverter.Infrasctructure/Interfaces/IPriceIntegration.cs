namespace CurrencyConverter.Infrasctructure.Interfaces
{
    public interface IPriceIntegration
    {
        string GrabLastPrice(string currencyName);
    }
}
