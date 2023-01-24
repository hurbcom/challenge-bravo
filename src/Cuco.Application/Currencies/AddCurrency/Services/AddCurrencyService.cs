using Cuco.Application.Base;
using Cuco.Application.Currencies.AddCurrency.Models;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Commons.Base;
using Cuco.Commons.Redis;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Newtonsoft.Json;

namespace Cuco.Application.Currencies.AddCurrency.Services;

internal class AddCurrencyService : IService<AddCurrencyInput, AddCurrencyOutput>
{
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IRedisCache _redisCache;
    private readonly IService<CurrencyConversionInput, CurrencyConversionOutput> _syncCurrencyService;
    private readonly IUnitOfWork _unitOfWork;

    public AddCurrencyService(IService<CurrencyConversionInput, CurrencyConversionOutput> syncCurrencyService,
        ICurrencyRepository currencyRepository, IUnitOfWork unitOfWork, IRedisCache redisCache)
    {
        _syncCurrencyService = syncCurrencyService;
        _currencyRepository = currencyRepository;
        _unitOfWork = unitOfWork;
        _redisCache = redisCache;
    }


    public async Task<AddCurrencyOutput> Handle(AddCurrencyInput input)
    {
        if (string.IsNullOrEmpty(input.Symbol) ||
            string.IsNullOrEmpty(input.Name) ||
            await _currencyRepository.ExistsBySymbolAsync(input.Symbol))
            return GetOutput(null);

        var currency = input.IsReal ? await AddRealCurrency(input) : await AddCustomCurrency(input);
        if (currency is null)
            return GetOutput(null);
        _currencyRepository.Insert(currency);
        _unitOfWork.Commit();
        return GetOutput(currency);
    }

    private async Task<Currency> AddRealCurrency(AddCurrencyInput input)
    {
        var symbolsSerialized = await _redisCache.GetAsync(RedisValues.CurrencySymbolsKey);
        if (string.IsNullOrEmpty(symbolsSerialized))
            return null;
        var symbols = JsonConvert.DeserializeObject<HashSet<string>>(symbolsSerialized);
        if (!symbols.Contains(input.Symbol.ToUpper()))
            return null;

        var cachedValue = decimal.Parse(await _redisCache.GetAsync(input.Symbol));
        return cachedValue == 0 ? null : new Currency(input.Name, input.Symbol, cachedValue, DateTime.Now, true);
    }

    private async Task<Currency> AddCustomCurrency(AddCurrencyInput input)
    {
        if (string.IsNullOrEmpty(input.BaseCurrencySymbol) || input.BaseCurrencyValue <= 0)
            return null;
        try
        {
            var convertToDollarOutput = await _syncCurrencyService.Handle(new CurrencyConversionInput
                { FromCurrency = input.BaseCurrencySymbol, ToCurrency = "USD", Amount = input.BaseCurrencyValue });
            if (convertToDollarOutput.ConvertedAmount is null)
                return null;

            await _redisCache.SetAsync(input.Symbol, input.BaseCurrencyValue.ToString());
            return new Currency(input.Name,
                input.Symbol,
                convertToDollarOutput.ConvertedAmount.Value,
                DateTime.Now,
                false);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }

    private static AddCurrencyOutput GetOutput(Currency currency)
    {
        return new AddCurrencyOutput
        {
            Currency = currency
        };
    }
}