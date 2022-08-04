using CurrencyConverterAPI.Domain.Models;

namespace CurrencyConverterAPI.Application.AppServices
{
    public interface IExchangeAppService
    {
        Task<CurrencyConvertedResponse> GetExchange(string from, string to, decimal amount);
    }
}
