using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Settings;
using Flurl;
using Flurl.Http;
using Polly;
using Polly.Retry;

namespace Cuco.Application.Adapters.Implementations;

public class OpenExchangeRateAdapter : ICurrencyExchangeRateAdapter
{
    private const string RatesEndpoint = "latest.json";
    private const string AppIdParam = "app_id";
    private const string ShowAlternativeParam = "show_alternative";

    private readonly OpenExchangeSettings _openExchangeSettings;
    private readonly AsyncRetryPolicy _retryPolicy;

    public OpenExchangeRateAdapter(OpenExchangeSettings openExchangeSettings)
    {
        _openExchangeSettings = openExchangeSettings;
        _retryPolicy = Policy.Handle<FlurlHttpException>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt - 1)));
    }

    public async Task<ExchangeRateResponse> GetAllRates()
    {
        try
        {
            return await _retryPolicy.ExecuteAsync(async ()
                => await GetFullRatesEndpoint(_openExchangeSettings.BaseUrl)
                .SetQueryParam(AppIdParam, _openExchangeSettings.AppId)
                .SetQueryParam(ShowAlternativeParam, true)
                .GetJsonAsync<ExchangeRateResponse>());
        ;
        }
        catch (Exception e)
        {
            Console.WriteLine(
                "An error occurred trying to Get the Exchange Rate of all Currencies available for Open Exchange API." +
                $"\nError: {e.Message}");
            return null;
        }
    }

    private static string GetFullRatesEndpoint(string baseUrl)
    {
        if (baseUrl.Last() != '/')
            return baseUrl + "/" + RatesEndpoint;
        return baseUrl + RatesEndpoint;
    }
}