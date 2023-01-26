using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;

namespace Cuco.Application.Services;

public interface IAddCurrencyService
{
    Task<SaveCurrencyResponse> AddCurrency(SaveCurrencyRequest request);
}