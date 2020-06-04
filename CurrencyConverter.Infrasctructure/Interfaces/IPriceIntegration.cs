namespace CurrencyConverter.Infrasctructure.Interfaces
{
    public interface IPriceIntegration
    {
        string GrabLastPrice(string currencyName);
        string GrabFromExternalSource(string url);
        string getUrl(string url);
    }
}
