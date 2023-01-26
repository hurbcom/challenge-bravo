using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;

namespace Cuco.Application.Services;

public interface IUpdateCurrencyService
{
    Task<SaveCurrencyResponse> UpdateCurrency(SaveCurrencyRequest request);
}