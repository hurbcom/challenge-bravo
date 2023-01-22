using Cuco.Application.Base;
using Cuco.Application.ListCurrencies.Models;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.ListCurrencies.Services;
internal class ListCurrenciesService : IService<ListCurrenciesInput, ListCurrenciesOutput>
{
    private readonly ICurrencyRepository _currencyRepository;

    public ListCurrenciesService(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    public async Task<ListCurrenciesOutput> Handle(ListCurrenciesInput input)
    {
        try
        {
            return new() { Currencies = await _currencyRepository.GetAllAsync() };
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed to Get all Currencies on the Database." +
                              $"\nError: {e.Message}");
            return new() { Currencies = null };
        }
    }
}
