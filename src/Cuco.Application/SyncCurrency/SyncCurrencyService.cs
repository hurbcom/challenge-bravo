using System.Globalization;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Services.Repositories;
using Cuco.Domain.ExchangeRates.Models;
using Cuco.Infra.Settings;
using Flurl;
using Flurl.Http;

namespace Cuco.Application.SyncCurrency;

public class SyncCurrencyService : ISyncCurrencyService
{
    private readonly OpenExchangeSettings _openExchangeSettings;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICache _cache;

    public SyncCurrencyService(ICurrencyRepository currencyRepository, ICache cache, OpenExchangeSettings openExchangeSettings, IUnitOfWork unitOfWork)
    {
        _currencyRepository = currencyRepository;
        _cache = cache;
        _openExchangeSettings = openExchangeSettings;
        _unitOfWork = unitOfWork;
    }

    public async Task SyncAllCurrenciesAsync()
    {
        var exchangeRates = await GetExchangeRates();
        var currencies = await _currencyRepository.GetAllAvailableAsync();
        foreach (var currency in currencies)
        {
            if (!exchangeRates.Rates.TryGetValue(currency.Symbol.ToUpper(), out var rate))
                continue;
            currency.SetValueInDollar(rate);
            currency.SetUpdatedAtUnix(exchangeRates.UnixTimestamp);
            await _cache.SetAsync(currency.Symbol, rate.ToString(CultureInfo.InvariantCulture));
        }

        _unitOfWork.Commit();
    }

    private async Task<ExchangeRateResponse> GetExchangeRates()
        => await _openExchangeSettings.Url
            .SetQueryParam("app_id", _openExchangeSettings.AppId)
            .SetQueryParam("show_alternative", 1)
            .GetJsonAsync<ExchangeRateResponse>();
}