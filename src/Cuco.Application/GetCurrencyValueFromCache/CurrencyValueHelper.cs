using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Models.Values;

namespace Cuco.Application.GetCurrencyValueFromCache;

public class GetCurrencyValueFromCacheService : ICurrencyValueHelper
{
    private readonly IRedisCache _redisCache;

    public GetCurrencyValueFromCacheService(IRedisCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task<bool> IsReal(string symbol)
        => (await GetCurrencyValue(symbol)).IsReal;

    public async Task<decimal> ValueInDollar(string symbol)
        => (await GetCurrencyValue(symbol)).ValueInDollar;

    public Task SetImaginaryCurrencyValue(string symbol, decimal value)
        => _redisCache.SetAsync(symbol, $"{value}:true");

    private async Task<CacheCurrencyValue> GetCurrencyValue(string symbol)
    {
        var cacheValue = await _redisCache.GetAsync(symbol);
        return CacheCurrencyValue.CreateFromCache(cacheValue);
    }
}