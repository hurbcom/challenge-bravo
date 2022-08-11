namespace CurrencyConverterAPI.Application.AppServices
{
    public interface IExchangeAppService
    {
        Task<dynamic> GetExchange(string from, string to, decimal amount);
        Task<IEnumerable<string>> GetAcronymCoins();
        Task<bool> IsExistAcronymInCache(string acronym);
        Task<bool> AcronymIsExistInAPI(string acronym);
        Task GetTestPolly(int code);
    }
}
