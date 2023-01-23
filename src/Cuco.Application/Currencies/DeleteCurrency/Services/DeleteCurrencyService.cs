using Cuco.Application.Base;
using Cuco.Application.DeleteCurrency.Models;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.DeleteCurrency.Services;

public class DeleteCurrencyService : IService<DeleteCurrencyInput, DeleteCurrencyOutput>
{
    private static readonly HashSet<string> NecessaryCurrencies = new() { "USD", "BRL", "EUR", "BTC", "ETH" };

    private readonly ICurrencyRepository _currencyRepository;

    public DeleteCurrencyService(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    public async Task<DeleteCurrencyOutput> Handle(DeleteCurrencyInput input)
    {
        try
        {
            if (string.IsNullOrEmpty(input.Symbol))
                return GetOutput(false, "String is null or empty.");
            if (NecessaryCurrencies.Contains(input.Symbol.ToUpper()))
                return GetOutput(false, $"Can't remove the currency with Symbol: {input.Symbol}");
            if (!await _currencyRepository.ExistsBySymbolAsync(input.Symbol))
                return GetOutput(false, $"There is no currency with Symbol: {input.Symbol}");

            return await _currencyRepository.DeleteBySymbolASync(input.Symbol)
                ? GetOutput(true, $"Deleted currency with Symbol {input.Symbol} successfully")
                : GetOutput(false, $"An unexpected error occurred while trying to remove symbol {input.Symbol}.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return GetOutput(false, $"An error occurred while trying to remove symbol {input.Symbol}." +
                                    $"\nError:{e.Message}");
        }
    }

    private static DeleteCurrencyOutput GetOutput(bool result, string details)
    {
        return new()
        {
            Result = result,
            Details = details
        };
    }
}