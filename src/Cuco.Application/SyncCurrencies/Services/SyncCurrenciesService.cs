using Cuco.Application.Base;
using Cuco.Application.SyncCurrencies.Models;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.SyncCurrencies.Services;

public class SyncCurrenciesService : IService<SyncCurrenciesInput, SyncCurrenciesOutput>
{
    private readonly ICurrencyAdapter _currencyAdapter;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRedisCache _redisCache;

    public SyncCurrenciesService(ICurrencyRepository currencyRepository, IRedisCache redisCache, IUnitOfWork unitOfWork, ICurrencyAdapter currencyAdapter)
    {
        _currencyRepository = currencyRepository;
        _redisCache = redisCache;
        _unitOfWork = unitOfWork;
        _currencyAdapter = currencyAdapter;
    }

    public async Task<SyncCurrenciesOutput> Handle(SyncCurrenciesInput input)
    {
        long timestamp;
        try
        {
            var exchangeRates = await _currencyAdapter.GetAllRates();
            timestamp = exchangeRates.Timestamp;
            var currencies = (await _currencyRepository.GetAllAsync()).ToList();

            foreach (var currency in currencies.Where(c => !c.Available))
            {
                if (exchangeRates.Rates.ContainsKey(currency.Symbol.ToUpper()))
                    exchangeRates.Rates.Remove(currency.Symbol.ToUpper());
                if (!await _redisCache.ExistsAsync(currency.Symbol.ToUpper()))
                    await _redisCache.LockSetAsync(currency.Symbol.ToUpper(), currency.ValueInDollar.ToString());
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

            await _redisCache.LockMultipleSetAsync(exchangeRates.Rates);

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
        => new()
        {
            Result = result,
            Timestamp = timestamp
        };
}