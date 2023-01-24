using Cuco.Application.Base;
using Cuco.Application.OpenExchangeRate.Adapters;
using Cuco.Application.SyncCurrencies.Models;
using Cuco.Commons.Base;
using Cuco.Commons.Redis;
using Cuco.Domain.Currencies.Services.Repositories;
using Newtonsoft.Json;

namespace Cuco.Application.SyncCurrencies.Services;

public class SyncCurrenciesService : IService<SyncCurrenciesInput, SyncCurrenciesOutput>
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

    public async Task<SyncCurrenciesOutput> Handle(SyncCurrenciesInput input)
    {
        long timestamp;
        try
        {
            var exchangeRates = await _currencyExchangeRateAdapter.GetAllRates();
            timestamp = exchangeRates.Timestamp;
            var currencies = (await _currencyRepository.GetAllAsync()).ToList();

            foreach (var currency in currencies.Where(c => !c.Available))
            {
                if (exchangeRates.Rates.ContainsKey(currency.Symbol.ToUpper()))
                    exchangeRates.Rates.Remove(currency.Symbol.ToUpper());
                if (!await _redisCache.ExistsAsync(currency.Symbol.ToUpper()))
                    await _redisCache.SetAsync(currency.Symbol.ToUpper(), currency.ValueInDollar.ToString());
                exchangeRates.Rates.Remove(currency.Symbol);
            }

            foreach (var symbol in exchangeRates.Rates.Keys)
            {
                var currency = currencies.FirstOrDefault(c =>
                    string.Equals(c.Symbol, symbol, StringComparison.OrdinalIgnoreCase));
                var rate = exchangeRates.Rates[symbol];
                if (currency is null) continue;
                currency.SetValueInDollar(rate);
                currency.SetUpdatedAtUnix(exchangeRates.Timestamp);
            }

            await _redisCache.MultipleSetAsync(exchangeRates.Rates);
            var symbols = JsonConvert.SerializeObject(exchangeRates.Rates.Select(r => r.Key).ToHashSet());
            await _redisCache.SetAsync(RedisValues.CurrencySymbolsKey, symbols);
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed to sync Currencies values with the external API." +
                              $"\nError: {e.Message}");
            return GetOutput(false, 0);
        }

        return GetOutput(_unitOfWork.Commit(), timestamp);
    }

    private static SyncCurrenciesOutput GetOutput(bool result, long timestamp)
    {
        return new SyncCurrenciesOutput
        {
            Result = result,
            Timestamp = timestamp
        };
    }
}