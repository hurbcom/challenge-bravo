using Cuco.Application.Base;
using Cuco.Application.OpenExchangeRate.Models;
using Cuco.Infra.Settings;
using Flurl;
using Flurl.Http;
using Microsoft.Extensions.Caching.Memory;

namespace Cuco.Application.OpenExchangeRate.Adapters;

public class OpenExchangeRateCurrencyAdapter : ICurrencyAdapter
{
    private const string RatesEndpoint = "latest.json";
    private const string SymbolsEndpoint = "currencies.json";
    private const string AppIdParam = "app_id";
    private const string ShowAlternativeParam = "show_alternative";

    private readonly OpenExchangeSettings _openExchangeSettings;
    private readonly IMemoryCache _memoryCache;

    public OpenExchangeRateCurrencyAdapter(OpenExchangeSettings openExchangeSettings, IMemoryCache memoryCache)
    {
        _openExchangeSettings = openExchangeSettings;
        _memoryCache = memoryCache;
    }

    public async Task<ExchangeRateResponse> GetAllRates()
    {
        try
        {
            return await (_openExchangeSettings.Url + RatesEndpoint)
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

    public async Task<bool> CheckIfSymbolExistsAsync(string symbol)
        => (await GetAllSymbols()).Symbols.ContainsKey(symbol);

    private async Task<SymbolsResponse> GetAllSymbols()
    {
        try
        {
            if (_memoryCache.TryGetValue("available_symbols", out SymbolsResponse symbolsResponse))
                return symbolsResponse;

            // If not, request them from the API
            var symbols = await (_openExchangeSettings.Url + SymbolsEndpoint)
                .SetQueryParam(AppIdParam, _openExchangeSettings.AppId)
                .SetQueryParam(ShowAlternativeParam, 1)
                .GetJsonAsync<IDictionary<string, string>>();
            symbolsResponse = new SymbolsResponse() { Symbols = symbols };
            return _memoryCache.Set("available_symbols", symbolsResponse);
        }
        catch (Exception e)
        {
            Console.WriteLine(
                "An error occurred trying to Get the Exchange Rate of all Currencies available for Open Exchange API." +
                $"\nError: {e.Message}");
            return null;
        }
    }
}
