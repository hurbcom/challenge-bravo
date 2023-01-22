using Cuco.Application.AddCurrency.Models;
using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.GetCurrencyValueFromCache;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.AddCurrency.Services;
internal class AddCurrencyService : IService<AddCurrencyInput, AddCurrencyOutput>
{
    private readonly IService<CurrencyConversionInput, CurrencyConversionOutput> _syncCurrencyService;
    private readonly ICurrencyValueHelper _currencyValueHelper;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddCurrencyService(IService<CurrencyConversionInput, CurrencyConversionOutput> syncCurrencyService,
        ICurrencyRepository currencyRepository, IUnitOfWork unitOfWork, ICurrencyValueHelper currencyValueHelper)
    {
        _syncCurrencyService = syncCurrencyService;
        _currencyRepository = currencyRepository;
        _unitOfWork = unitOfWork;
        _currencyValueHelper = currencyValueHelper;
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
        if (!await _currencyValueHelper.IsReal(input.Symbol))
            return GetOutput(null);

        var valueIndDollar = await _currencyValueHelper.ValueInDollar(input.Symbol);
        if (valueIndDollar == 0)
            return GetOutput(null);

        var currency = new Currency(input.Name, input.Symbol, valueIndDollar, DateTime.Now, true);
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
            await _currencyValueHelper.SetImaginaryCurrencyValue(currency.Symbol, currency.ValueInDollar);
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
