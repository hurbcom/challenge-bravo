using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;

namespace Cuco.Application.Services;

public interface ICurrencyConversionService
{
    Task<CurrencyConversionResponse> ConvertCurrency(CurrencyConversionRequest request);
}