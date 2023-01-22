using Cuco.Application.OpenExchangeRate.Models;

namespace Cuco.Application.OpenExchangeRate.Adapters;

public interface ICurrencyExchangeRateAdapter
{
    Task<ExchangeRateResponse> GetAllRates();
}