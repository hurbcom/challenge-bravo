using Cuco.Application.AddCurrency.Models;
using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Commons;
using Cuco.Commons.Base;
using Cuco.Commons.Redis;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Newtonsoft.Json;

namespace Cuco.Application.AddCurrency.Services;
internal class AddCurrencyService : IService<AddCurrencyInput, AddCurrencyOutput>
{
    private readonly IService<CurrencyConversionInput, CurrencyConversionOutput> _syncCurrencyService;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRedisCache _redisCache;

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

        return input.IsReal ? await AddRealCurrency(input) : await AddCustomCurrency(input);
    }

    private async Task<AddCurrencyOutput> AddRealCurrency(AddCurrencyInput input)
    {
        var symbolsSerialized = await _redisCache.GetAsync(RedisValues.CurrencySymbolsKey);
        if (string.IsNullOrEmpty(symbolsSerialized))
            return GetOutput(null);
        var symbols = JsonConvert.DeserializeObject<HashSet<string>>(symbolsSerialized);
        if (!symbols.Contains(input.Symbol.ToUpper()))
            return GetOutput(null);

        var cachedValue = decimal.Parse(await _redisCache.GetAsync(input.Symbol));
        if (cachedValue == 0)
            return GetOutput(null);

        var currency = new Currency(input.Name, input.Symbol, cachedValue, DateTime.Now, true);
        await _currencyRepository.AddAsync(currency);
        _unitOfWork.Commit();
        return GetOutput(currency);
    }

    private async Task<AddCurrencyOutput> AddCustomCurrency(AddCurrencyInput input)
    {
        if (string.IsNullOrEmpty(input.BaseCurrencySymbol) || input.BaseCurrencyValue <= 0)
            return GetOutput(null);
        try
        {
            var convertToDollarOutput = await _syncCurrencyService.Handle(new()
                { FromCurrency = input.BaseCurrencySymbol, ToCurrency = "USD", Amount = input.BaseCurrencyValue });
            if (convertToDollarOutput.ConvertedAmount is null)
                return GetOutput(null);

            var currency = new Currency(input.Name, input.Symbol, convertToDollarOutput.ConvertedAmount.Value, DateTime.Now,
                false);
            await _redisCache.SetAsync(currency.Symbol, currency.ValueInDollar.ToString());
            _unitOfWork.Commit();
            return GetOutput(currency);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return GetOutput(null);
        }
    }

    private static AddCurrencyOutput GetOutput(Currency currency)
        => new()
        {
            Currency = currency
        };
}
