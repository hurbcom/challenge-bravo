namespace CurrencyConverterAPI.Services
{
    public interface IExchangeService
    {
        Task<IDictionary<string, object>> GetExchangeRates();
        Task GetTestPolly(int code);
    }
}
