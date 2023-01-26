using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Extensions;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.Services.Implementations;

public class UpdateCurrencyService : IUpdateCurrencyService
{
    private readonly IConvertToDollarService _getCurrencyInUsdService;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IRedisCache _redisCache;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCurrencyService(IConvertToDollarService getCurrencyInUsdService,
        ICurrencyRepository currencyRepository,
        IRedisCache redisCache,
        IUnitOfWork unitOfWork)
    {
        _getCurrencyInUsdService = getCurrencyInUsdService;
        _currencyRepository = currencyRepository;
        _redisCache = redisCache;
        _unitOfWork = unitOfWork;
    }

    public async Task<SaveCurrencyResponse> UpdateCurrency(SaveCurrencyRequest request)
    {
        if (string.IsNullOrEmpty(request.Symbol) ||
            await _currencyRepository.GetBySymbolAsync(request.Symbol) is not { } currency)
            return GetOutput(null, false);
        if (currency.Available)
            return GetOutput(null, false);


        if (ValueChanged(request))
            if (!await UpdateCurrencyValue(request, currency))
                return GetOutput(currency, false);
        if (!string.IsNullOrEmpty(request.Name) && request.Name != currency.Name)
            currency.SetName(request.Name);

        var result = _unitOfWork.Commit();
        return GetOutput(currency, result);
    }

    private static bool ValueChanged(SaveCurrencyRequest request)
    {
        return !string.IsNullOrEmpty(request.BaseCurrencySymbol) && request.ValueInBaseCurrency.HasValue;
    }

    private async Task<bool> UpdateCurrencyValue(SaveCurrencyRequest request, Currency currency)
    {
        try
        {
            var valueInDollar = (await _getCurrencyInUsdService.Convert(new[] { request.BaseCurrencySymbol }))[0];
            if (valueInDollar == 0)
                return false;

            if (currency.ValueInDollar == valueInDollar)
                return true;

            await _redisCache.SetAsync(currency.Symbol, valueInDollar.ToString());
            currency.SetValueInDollar(valueInDollar);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
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