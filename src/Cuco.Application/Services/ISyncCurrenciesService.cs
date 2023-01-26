using Cuco.Application.Contracts.Responses;

namespace Cuco.Application.Services;

public interface ISyncCurrenciesService
{
    Task<SyncCurrenciesResponse> SyncCurrencies();
}