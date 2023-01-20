using System.Diagnostics;
using Cuco.Application.SyncCurrency;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Services.Repositories;
using Cuco.Infra.Settings;

namespace Cuco.Application.GetCurrencyInUSD;
internal class GetCurrencyInUsdService : IGetCurrencyInUsdService
{
    private const string BaseCurrencySymbol = "USD";

    private readonly ISyncCurrencyService _syncCurrencyService;
    private readonly OpenExchangeSettings _openExchangeSettings;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly ICache _cache;

    public GetCurrencyInUsdService(OpenExchangeSettings openExchangeSettings, ICurrencyRepository currencyRepository, ICache cache, ISyncCurrencyService syncCurrencyService)
    {
        _openExchangeSettings = openExchangeSettings;
        _currencyRepository = currencyRepository;
        _cache = cache;
        _syncCurrencyService = syncCurrencyService;
    }


    public async Task<decimal?> GetCurrencyInUsdAsync(string symbol)
    {
        symbol= symbol.ToUpper();
        if (symbol == BaseCurrencySymbol) return 1;

        return await IsAvailable(symbol) ?
            await GetAvailableCurrencyValue(symbol) :
            await GetUnavailableCurrencyValue(symbol);
    }

    private async Task<decimal?> GetUnavailableCurrencyValue(string symbol)
        => decimal.TryParse(await _cache.GetAsync(symbol), out var currencyValue) ?
            currencyValue :
            null;

    private async Task<decimal?> GetAvailableCurrencyValue(string symbol)
    {
        if (await _currencyRepository.GetBySymbolAsync(symbol) is not { } currency)
            return null;

        if ((DateTime.Now - currency.LastUpdateAt.Value).TotalSeconds >= _openExchangeSettings.TimeToUpdateInSeconds)
            await _syncCurrencyService.SyncAllCurrenciesAsync();

        return currency.ValueInDollar;
    }

    private async Task<bool> IsAvailable(string currency)
        => await _currencyRepository.IsAvailableAsync(currency);

}
