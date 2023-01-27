using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Base;
using Cuco.Commons.Resources;
using Cuco.Domain.Currencies.Extensions;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.AspNetCore.Http;

namespace Cuco.Application.Services.Implementations;

public class UpdateCurrencyService : IUpdateCurrencyService
{
    private readonly IGetDollarValueService _getCurrencyInUsdValueService;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IRedisCache _redisCache;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCurrencyService(IGetDollarValueService getCurrencyInUsdValueService,
        ICurrencyRepository currencyRepository,
        IRedisCache redisCache,
        IUnitOfWork unitOfWork)
    {
        _getCurrencyInUsdValueService = getCurrencyInUsdValueService;
        _currencyRepository = currencyRepository;
        _redisCache = redisCache;
        _unitOfWork = unitOfWork;
    }

    public async Task<SaveCurrencyResponse> UpdateCurrency(SaveCurrencyRequest request)
    {
        var validationErrors = await ValidateCurrency(request);
        if (!string.IsNullOrEmpty(validationErrors))
            return GetResponse(validationErrors, StatusCodes.Status400BadRequest);

        var currency = await _currencyRepository.GetBySymbolAsync(request.Symbol);
        if (!currency.Available && HasValueChanged(request) && !await UpdateCurrencyValue(request, currency))
            return GetResponse(ErrorResources.FailedToUpdateCurrencyValue, StatusCodes.Status503ServiceUnavailable, currency);

        if (HasNameChanged(request, currency))
            currency.SetName(request.Name);

        return _unitOfWork.Commit()
            ? GetResponse(DetailsResources.SuccessfullyUpdatedCurrency, StatusCodes.Status200OK, currency)
            : GetResponse(ErrorResources.FailedToCommitChanges, StatusCodes.Status503ServiceUnavailable, currency);
    }

    private async Task<bool> UpdateCurrencyValue(SaveCurrencyRequest request, Currency currency)
    {
        try
        {
            var valueInDollar = (await _getCurrencyInUsdValueService.Convert(new[] { request.BaseCurrencySymbol }))[0];
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

    private static bool HasNameChanged(SaveCurrencyRequest request, Currency currency)
    {
        return !string.IsNullOrEmpty(request.Name) && request.Name != currency.Name;
    }

    private static bool HasValueChanged(SaveCurrencyRequest request)
    {
        return !string.IsNullOrEmpty(request.BaseCurrencySymbol) && request.ValueInBaseCurrency.HasValue;
    }

    private static SaveCurrencyResponse GetResponse(string details, int statusCode, Currency currency = null)
    {
        return new SaveCurrencyResponse
        {
            Currency = currency?.ToDto(),
            StatusCode = statusCode,
            Details = details
        };
    }

    private async Task<string> ValidateCurrency(SaveCurrencyRequest request)
    {
        var currencyValidationErrors = request.IsValid();
        if (string.IsNullOrEmpty(currencyValidationErrors))
        {
            return currencyValidationErrors;
        }

        if (await _currencyRepository.ExistsBySymbolAsync(request.Symbol))
        {
            return request.Symbol.CurrencyDoesNotExist();
        }

        return string.Empty;
    }
}