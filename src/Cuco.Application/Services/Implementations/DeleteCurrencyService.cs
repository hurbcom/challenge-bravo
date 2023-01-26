using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Resources;
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
            var errorMessages = await ValidateSymbol(symbol);
            if (!string.IsNullOrEmpty(errorMessages)) return GetOutput(false, errorMessages);

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

    private async Task<string> ValidateSymbol(string symbol)
    {
        if (string.IsNullOrEmpty(symbol))
        {
            return ErrorResources.SymbolMustExist;
        }

        if (NecessaryCurrencies.Contains(symbol.ToUpper()))
        {
            return symbol.CannotDeleteCurrency();
        }

        if (!await _currencyRepository.ExistsBySymbolAsync(symbol))
        {
            return symbol.CurrencyDoesNotExist();
        }

        return string.Empty;
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