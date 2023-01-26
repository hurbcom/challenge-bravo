using Cuco.Application.Contracts.Responses;

namespace Cuco.Application.Adapters;

public interface ICurrencyExchangeRateAdapter
{
    Task<ExchangeRateResponse> GetAllRates();
}