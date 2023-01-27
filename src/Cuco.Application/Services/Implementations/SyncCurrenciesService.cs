using Cuco.Application.Adapters;
using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Base;
using Cuco.Commons.Redis;
using Cuco.Commons.Resources;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Cuco.Application.Services.Implementations;

public class SyncCurrenciesService : ISyncCurrenciesService
{
    private readonly ICurrencyExchangeRateAdapter _currencyExchangeRateAdapter;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IRedisCache _redisCache;
    private readonly IUnitOfWork _unitOfWork;

    public SyncCurrenciesService(ICurrencyExchangeRateAdapter currencyExchangeRateAdapter,
        ICurrencyRepository currencyRepository,
        IRedisCache redisCache,
        IUnitOfWork unitOfWork)
    {
        _currencyExchangeRateAdapter = currencyExchangeRateAdapter;
        _currencyRepository = currencyRepository;
        _redisCache = redisCache;
        _unitOfWork = unitOfWork;
    }


    public async Task<SyncCurrenciesResponse> SyncCurrencies()
    {
        long timestamp;
        try
        {
            var exchangeRates = await _currencyExchangeRateAdapter.GetAllRates();
            if (exchangeRates?.Rates is null || !exchangeRates.Rates.Any())
                return GetResponse(ErrorResources.FailedToRetrieveExchangeRatesFromExternalApi, StatusCodes.Status502BadGateway);

            timestamp = exchangeRates.Timestamp;
            var currencies = (await _currencyRepository.GetAllAsync())?.ToList();
            if (currencies is null || !currencies.Any())
                return GetResponse(ErrorResources.FailedToGetListOfCurrencies, StatusCodes.Status503ServiceUnavailable);

            await SyncNotAvailableCurrencies(currencies, exchangeRates);
            SyncAvailableCurrencies(exchangeRates, currencies);
            await UpdateRedisWithNewExchangesAndSymbols(exchangeRates);
        }
        catch
        {
            return GetResponse(ErrorResources.UnexpectedErrorOccurred, StatusCodes.Status500InternalServerError);
        }

        return _unitOfWork.Commit()
            ? GetResponse(DetailsResources.SuccessfullySyncedCurrencies, StatusCodes.Status200OK, timestamp)
            : GetResponse(ErrorResources.FailedToCommitChanges, StatusCodes.Status503ServiceUnavailable, timestamp);
    }

    private async Task SyncNotAvailableCurrencies(List<Currency> currencies, ExchangeRateResponse exchangeRates)
    {
        foreach (var currency in currencies.Where(c => !c.Available))
        {
            if (exchangeRates.Rates.ContainsKey(currency.Symbol.ToUpper()))
                exchangeRates.Rates.Remove(currency.Symbol.ToUpper());
            if (!await _redisCache.ExistsAsync(currency.Symbol.ToUpper()))
                await _redisCache.SetAsync(currency.Symbol.ToUpper(), currency.ValueInDollar.ToString());
            exchangeRates.Rates.Remove(currency.Symbol);
        }
    }

    private static void SyncAvailableCurrencies(ExchangeRateResponse exchangeRates, IList<Currency> currencies)
    {
        foreach (var symbol in exchangeRates.Rates.Keys)
        {
            var currency = currencies.FirstOrDefault(c =>
                string.Equals(c.Symbol, symbol, StringComparison.OrdinalIgnoreCase));
            if (currency is null) continue;
            var rate = exchangeRates.Rates[symbol];
            currency.SetValueInDollar(rate);
            currency.SetUpdatedAtUnix(exchangeRates.Timestamp);
        }
    }

    private async Task UpdateRedisWithNewExchangesAndSymbols(ExchangeRateResponse exchangeRates)
    {
        await _redisCache.MultipleSetAsync(exchangeRates.Rates);
        var symbols = JsonConvert.SerializeObject(exchangeRates.Rates.Select(r => r.Key).ToHashSet());
        await _redisCache.SetAsync(RedisValues.CurrencySymbolsKey, symbols);
    }

    private static SyncCurrenciesResponse GetResponse(string details, int statusCode, long timestamp = 0)
    {
        return new SyncCurrenciesResponse
        {
            Details = details,
            StatusCode = statusCode,
            Timestamp = timestamp
        };
    }

}