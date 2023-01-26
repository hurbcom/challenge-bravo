using Cuco.Application.Contracts.Responses;

namespace Cuco.Application.Services;

public interface IDeleteCurrencyService
{
    Task<DeleteCurrencyResponse> DeleteCurrency(string symbol);
}