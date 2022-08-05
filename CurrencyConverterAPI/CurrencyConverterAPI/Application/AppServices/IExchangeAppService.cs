using CurrencyConverterAPI.Domain.Models;

namespace CurrencyConverterAPI.Application.AppServices
{
    public interface IExchangeAppService
    {
        Task<dynamic> GetExchange(string from, string to, decimal amount);
        Task GetTestPolly(int code);
    }
}
