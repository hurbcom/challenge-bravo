using Cuco.Application.Base;
using Cuco.Application.GetCurrencyInUSD.Models;
using Cuco.Application.GetCurrencyValueFromCache;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.GetCurrencyInUSD.Services;
internal class GetCurrencyInUsdService : IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput>
{
    private const string BaseCurrencySymbol = "USD";
    private const decimal BaseValue = 1;
    private const decimal DefaultNonValue = 0;

    private readonly ICurrencyRepository _currencyRepository;
    private readonly ICurrencyValueHelper _currencyValueHelper;

    public GetCurrencyInUsdService(ICurrencyRepository currencyRepository, ICurrencyValueHelper currencyValueHelper)
    {
        _currencyRepository = currencyRepository;
        _currencyValueHelper = currencyValueHelper;
    }

    public async Task<GetCurrencyInUsdOutput> Handle(GetCurrencyInUsdInput input)
    {
        if (string.IsNullOrEmpty(input.Symbol))
            return GetOutput(DefaultNonValue);

        var symbol= input.Symbol.ToUpper();
        if (symbol == BaseCurrencySymbol) return GetOutput(BaseValue);

        return await GetValue(symbol);
    }

    private async Task<GetCurrencyInUsdOutput> GetValue(string symbol)
    {
        try
        {
            var value = await _currencyValueHelper.ValueInDollar(symbol);
            if (value > 0)
                return GetOutput(value);
            var currency = await _currencyRepository.GetBySymbolAsync(symbol);
            return GetOutput(currency.ValueInDollar);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return GetOutput(DefaultNonValue);
        }
    }

    private static GetCurrencyInUsdOutput GetOutput(decimal valueInDollar)
        => new()
        {
            ValueInDollar = valueInDollar
        };
}
