using Cuco.Application.OpenExchangeRate.Models;

namespace Cuco.Application.Base;

public interface ICurrencyAdapter
{
    Task<ExchangeRateResponse> GetAllRates();
    Task<bool> CheckIfSymbolExistsAsync(string symbol);
}