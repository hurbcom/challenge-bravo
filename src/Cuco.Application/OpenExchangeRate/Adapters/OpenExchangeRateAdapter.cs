using Cuco.Application.Base;
using Cuco.Application.OpenExchangeRate.Models;
using Cuco.Infra.Settings;
using Flurl;
using Flurl.Http;

namespace Cuco.Application.OpenExchangeRate.Adapters;

public class OpenExchangeRateAdapter : ICurrencyExchangeRateAdapter
{
    private const string RatesEndpoint = "latest.json";
    private const string AppIdParam = "app_id";
    private const string ShowAlternativeParam = "show_alternative";

    private readonly OpenExchangeSettings _openExchangeSettings;

    public OpenExchangeRateAdapter(OpenExchangeSettings openExchangeSettings)
    {
        _openExchangeSettings = openExchangeSettings;
    }

    public async Task<ExchangeRateResponse> GetAllRates()
    {
        try
        {
            return await (_openExchangeSettings.BaseUrl + RatesEndpoint)
                .SetQueryParam(AppIdParam, _openExchangeSettings.AppId)
                .SetQueryParam(ShowAlternativeParam, 1)
                .GetJsonAsync<ExchangeRateResponse>();
        }
        catch (Exception e)
        {
            Console.WriteLine("An error occurred trying to Get the Exchange Rate of all Currencies available for Open Exchange API." +
                              $"\nError: {e.Message}");
            return null;
        }
    }
}
