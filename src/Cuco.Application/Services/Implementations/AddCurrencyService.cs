using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Base;
using Cuco.Commons.Redis;
using Cuco.Domain.Currencies.Extensions;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Newtonsoft.Json;

namespace Cuco.Application.Services.Implementations;

internal class AddCurrencyService : IAddCurrencyService
{
    private readonly ICurrencyConversionService _currencyConversionService;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IRedisCache _redisCache;
    private readonly IUnitOfWork _unitOfWork;

    public AddCurrencyService(ICurrencyConversionService currencyConversionService,
        ICurrencyRepository currencyRepository,
        IRedisCache redisCache,
        IUnitOfWork unitOfWork)
    {
        _currencyConversionService = currencyConversionService;
        _currencyRepository = currencyRepository;
        _redisCache = redisCache;
        _unitOfWork = unitOfWork;
    }


    public async Task<SaveCurrencyResponse> AddCurrency(SaveCurrencyRequest request)
    {
        if (string.IsNullOrEmpty(request.Symbol) ||
            string.IsNullOrEmpty(request.Name) ||
            await _currencyRepository.ExistsBySymbolAsync(request.Symbol))
            return GetOutput(null, false);

        var currency = request.IsReal ? await AddRealCurrency(request) : await AddCustomCurrency(request);
        if (currency is null)
            return GetOutput(null, false);
        _currencyRepository.Insert(currency);
        var result = _unitOfWork.Commit();
        return GetOutput(currency, result);
    }

    private async Task<Currency> AddRealCurrency(SaveCurrencyRequest request)
    {
        var symbolsSerialized = await _redisCache.GetAsync(RedisValues.CurrencySymbolsKey);
        if (string.IsNullOrEmpty(symbolsSerialized))
            return null;
        var symbols = JsonConvert.DeserializeObject<HashSet<string>>(symbolsSerialized);
        if (!symbols.Contains(request.Symbol.ToUpper()))
            return null;

        var cachedValue = decimal.Parse(await _redisCache.GetAsync(request.Symbol));
        return cachedValue == 0 ? null : new Currency(request.Name, request.Symbol, cachedValue, DateTime.Now, true);
    }

    private async Task<Currency> AddCustomCurrency(SaveCurrencyRequest request)
    {
        if (string.IsNullOrEmpty(request.BaseCurrencySymbol) || request.ValueInBaseCurrency is null or <= 0)
            return null;
        try
        {
            var convertToDollarResponse = await _currencyConversionService.ConvertCurrency(new()
            {
                FromCurrency = request.BaseCurrencySymbol,
                ToCurrency = "USD",
                Amount = request.ValueInBaseCurrency.Value
            });
            if (convertToDollarResponse.ConvertedAmount is null)
                return null;

            await _redisCache.SetAsync(request.Symbol, request.ValueInBaseCurrency.ToString());
            return new Currency(request.Name,
                request.Symbol,
                convertToDollarResponse.ConvertedAmount.Value,
                DateTime.Now,
                false);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }

    private static SaveCurrencyResponse GetOutput(Currency currency, bool result)
    {
        return new SaveCurrencyResponse
        {
            Currency = currency.ToDto(),
            Result = result
        };
    }
}