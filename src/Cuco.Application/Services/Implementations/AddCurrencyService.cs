using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Base;
using Cuco.Commons.Redis;
using Cuco.Commons.Resources;
using Cuco.Domain.Currencies.Extensions;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.AspNetCore.Http;
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
        var validationErrors = await ValidateCurrency(request);
        if (!string.IsNullOrEmpty(validationErrors))
            return GetResponse(validationErrors, StatusCodes.Status400BadRequest);

        var currency = request.IsReal ? await AddRealCurrency(request) : await AddCustomCurrency(request);
        if (currency is null)
            return GetResponse(ErrorResources.CurrencyCreationProblem, StatusCodes.Status503ServiceUnavailable);
        _currencyRepository.Insert(currency);
        return _unitOfWork.Commit()
            ? GetResponse(DetailsResources.SuccessfullyAddedCurrency, StatusCodes.Status201Created, currency)
            : GetResponse(ErrorResources.FailedToCommitChanges, StatusCodes.Status503ServiceUnavailable, currency);
    }

    private async Task<Currency> AddRealCurrency(SaveCurrencyRequest request)
    {
        var symbolsSerialized = await _redisCache.GetAsync(RedisValues.CurrencySymbolsKey);
        if (string.IsNullOrEmpty(symbolsSerialized))
            return null;
        var symbols = JsonConvert.DeserializeObject<HashSet<string>>(symbolsSerialized);
        if (!symbols.Contains(request.Symbol.ToUpper()))
            return null;

        return decimal.TryParse(await _redisCache.GetAsync(request.Symbol.ToUpper()), out var cachedValue)
            ? new Currency(request.Name, request.Symbol, cachedValue, DateTime.Now, true)
            : null;
    }

    private async Task<Currency> AddCustomCurrency(SaveCurrencyRequest request)
    {
        try
        {
            var convertToDollarResponse = await _currencyConversionService.ConvertCurrency(new()
            {
                FromCurrency = request.BaseCurrencySymbol,
                ToCurrency = "USD",
                Amount = request.ValueInBaseCurrency ?? 0
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
        if (!string.IsNullOrEmpty(currencyValidationErrors))
        {
            return currencyValidationErrors;
        }

        if (await _currencyRepository.ExistsBySymbolAsync(request.Symbol))
        {
             return ErrorResources.AddingCurrencyThatAlreadyExists;
        }

        return string.Empty;
    }
}