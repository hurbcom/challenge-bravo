using Cuco.Application.Base;
using Cuco.Application.GetCurrencyInUSD.Models;
using Cuco.Application.UpdateCurrency.Models;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.UpdateCurrency.Services;

public class UpdateCurrencyService : IService<UpdateCurrencyInput, UpdateCurrencyOutput>
{
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput> _getCurrencyInUsdService;
    private readonly IRedisCache _redisCache;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCurrencyService(
        IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput> getCurrencyInUsdService,
        ICurrencyRepository currencyRepository,
        IRedisCache redisCache,
        IUnitOfWork unitOfWork)
    {
        _getCurrencyInUsdService = getCurrencyInUsdService;
        _currencyRepository = currencyRepository;
        _redisCache = redisCache;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateCurrencyOutput> Handle(UpdateCurrencyInput input)
    {
        if (string.IsNullOrEmpty(input.Symbol) ||
            await _currencyRepository.GetBySymbolAsync(input.Symbol) is not { } currency)
            return GetOutput(null, false);
        if (currency.Available)
            return GetOutput(null, false);


        if (!string.IsNullOrEmpty(input.BaseCurrencySymbol) && input.BaseCurrencyValue.HasValue)
            if (!await UpdateCurrencyValue(input, currency))
                return GetOutput(currency, false);
        if (!string.IsNullOrEmpty(input.Name) && input.Name != currency.Name)
            currency.SetName(input.Name);

        var result = _unitOfWork.Commit();
        return GetOutput(currency, result);
    }

    private async Task<bool> UpdateCurrencyValue(UpdateCurrencyInput input, Currency currency)
    {
        try
        {
            var valueInDollarOutput = await _getCurrencyInUsdService.Handle(new GetCurrencyInUsdInput
                { Symbol = input.BaseCurrencySymbol });
            if (valueInDollarOutput.ValueInDollar == 0)
                return false;

            if (currency.ValueInDollar == valueInDollarOutput.ValueInDollar)
                return true;

            await _redisCache.SetAsync(currency.Symbol, valueInDollarOutput.ValueInDollar.ToString());
            currency.SetValueInDollar(valueInDollarOutput.ValueInDollar);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }

    private static UpdateCurrencyOutput GetOutput(Currency currency, bool result)
    {
        return new UpdateCurrencyOutput
        {
            Currency = currency,
            Result = result
        };
    }
}