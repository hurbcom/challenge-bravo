using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Resources;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.AspNetCore.Http;

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
            if (!string.IsNullOrEmpty(errorMessages)) return GetOutput(StatusCodes.Status400BadRequest, errorMessages);

            return await _currencyRepository.DeleteBySymbolAsync(symbol)
                ? GetOutput(StatusCodes.Status200OK, DetailsResources.SuccessfullyDeletedCurrency)
                : GetOutput(StatusCodes.Status503ServiceUnavailable, ErrorResources.FailedToDeleteCurrency);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return GetOutput(StatusCodes.Status503ServiceUnavailable, ErrorResources.UnexpectedErrorOccurred);
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

    private static DeleteCurrencyResponse GetOutput(int statusCode, string details)
    {
        return new DeleteCurrencyResponse
        {
            StatusCode = statusCode,
            Details = details
        };
    }
}