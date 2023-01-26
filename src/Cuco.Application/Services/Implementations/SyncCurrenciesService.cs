using Cuco.Application.Adapters;
using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Base;
using Cuco.Commons.Redis;
using Cuco.Commons.Resources;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Newtonsoft.Json;

namespace Cuco.Application.Services.Implementations;

public class SyncCurrenciesService : ISyncCurrenciesService
{
    private readonly ICurrencyExchangeRateAdapter _currencyExchangeRateAdapter;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IRedisCache _redisCache;
    private readonly IUnitOfWork _unitOfWork;

    public SyncCurrenciesService(ICurrencyRepository currencyRepository, IRedisCache redisCache, IUnitOfWork unitOfWork,
        ICurrencyExchangeRateAdapter currencyExchangeRateAdapter)
    {
        _currencyRepository = currencyRepository;
        _redisCache = redisCache;
        _unitOfWork = unitOfWork;
        _currencyExchangeRateAdapter = currencyExchangeRateAdapter;
    }


    public async Task<SyncCurrenciesResponse> SyncCurrencies()
    {
        long timestamp;
        try
        {
            var exchangeRates = await _currencyExchangeRateAdapter.GetAllRates();
            if (exchangeRates?.Rates is null || !exchangeRates.Rates.Any())
                return GetResponse(ErrorResources.FailedToRetrieveExchangeRatesFromExternalApi, false);

            timestamp = exchangeRates.Timestamp;
            var currencies = (await _currencyRepository.GetAllAsync())?.ToList();
            if (currencies is null || !currencies.Any())
                return GetResponse(ErrorResources.FailedToGetListOfCurrencies, false);

            await SyncNotAvailableCurrencies(currencies, exchangeRates);
            SyncAvailableCurrencies(exchangeRates, currencies);
            await UpdateRedisWithNewExchangesAndSymbols(exchangeRates);
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed to sync Currencies values with the external API." +
                              $"\nError: {e.Message}");
            throw new Exception(e.Message);
        }

        return GetResponse(DetailsResources.SuccessfullySyncedCurrencies, _unitOfWork.Commit(), timestamp);
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

    private void SyncAvailableCurrencies(ExchangeRateResponse exchangeRates, List<Currency> currencies)
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
        _unitOfWork.Commit();
    }

    private async Task UpdateRedisWithNewExchangesAndSymbols(ExchangeRateResponse exchangeRates)
    {
        await _redisCache.MultipleSetAsync(exchangeRates.Rates);
        var symbols = JsonConvert.SerializeObject(exchangeRates.Rates.Select(r => r.Key).ToHashSet());
        await _redisCache.SetAsync(RedisValues.CurrencySymbolsKey, symbols);
    }

    private static SyncCurrenciesResponse GetResponse(string details, bool result, long timestamp = 0)
    {
        return new SyncCurrenciesResponse
        {
            Details = details,
            Result = result,
            Timestamp = timestamp
        };
    }

}