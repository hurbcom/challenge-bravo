using Cuco.Application.AddCurrency.Models;
using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.AddCurrency.Services;
internal class AddCurrencyService : IService<AddCurrencyInput, AddCurrencyOutput>
{
    private readonly IService<CurrencyConversionInput, CurrencyConversionOutput> _syncCurrencyService;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly ICurrencyAdapter _currencyAdapter;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRedisCache _redisCache;

    public AddCurrencyService(IService<CurrencyConversionInput, CurrencyConversionOutput> syncCurrencyService,
        ICurrencyRepository currencyRepository, ICurrencyAdapter currencyAdapter, IUnitOfWork unitOfWork,
        IRedisCache redisCache)
    {
        _syncCurrencyService = syncCurrencyService;
        _currencyRepository = currencyRepository;
        _currencyAdapter = currencyAdapter;
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
        if (!await _currencyAdapter.CheckIfSymbolExistsAsync(input.Symbol))
            return GetOutput(null);

        var symbolValue = await _redisCache.GetAsync(input.Symbol);
        if (string.IsNullOrEmpty(symbolValue))
            return GetOutput(null);

        var valueInDollar = decimal.Parse(symbolValue);
        var currency = new Currency(input.Name, input.Symbol, 1/valueInDollar, DateTime.Now, true);
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
            await _currencyRepository.AddAsync(currency);
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
