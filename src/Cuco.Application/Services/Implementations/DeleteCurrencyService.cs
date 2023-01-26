using Cuco.Application.Contracts.Responses;
using Cuco.Domain.Currencies.Services.Repositories;

namespace Cuco.Application.Services.Implementations;

public class DeleteCurrencyService : IDeleteCurrencyService
{
    private static readonly HashSet<string> NecessaryCurrencies = new() { "USD", "BRL", "EUR", "BTC", "ETH" };

    private readonly ICurrencyRepository _currencyRepository;

    public DeleteCurrencyService(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    public async Task<DeleteCurrencyResponse> DeleteCurrency(string symbol)
    {
        try
        {
            if (string.IsNullOrEmpty(symbol))
                return GetOutput(false, "String is null or empty.");
            if (NecessaryCurrencies.Contains(symbol.ToUpper()))
                return GetOutput(false, $"Can't remove the currency with Symbol: {symbol}");
            if (!await _currencyRepository.ExistsBySymbolAsync(symbol))
                return GetOutput(false, $"There is no currency with Symbol: {symbol}");

            return await _currencyRepository.DeleteBySymbolASync(symbol)
                ? GetOutput(true, $"Deleted currency with Symbol {symbol} successfully")
                : GetOutput(false, $"An unexpected error occurred while trying to remove symbol {symbol}.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return GetOutput(false, $"An error occurred while trying to remove symbol {symbol}." +
                                    $"\nError:{e.Message}");
        }
    }


    private static DeleteCurrencyResponse GetOutput(bool result, string details)
    {
        return new DeleteCurrencyResponse
        {
            Result = result,
            Details = details
        };
    }
}