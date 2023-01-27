namespace Cuco.Commons.Resources;

public static class ErrorResources
{
    public static string CannotDeleteCurrency(this string symbol)
    {
        return $"Can't remove the currency with Symbol: {symbol}";
    }
    public static string CurrencyDoesNotExist(this string symbol)
    {
        return $"There is no currency with Symbol: {symbol}";
    }

    public const string UnexpectedErrorOccurred = "An unexpected error has occurred while trying to process your request.";
    public const string AddingCurrencyThatAlreadyExists = "The currency you are trying to add already exists.";
    public const string CurrencyNameMustExist = "A name must be specified for a currency.";
    public const string CurrencyNameLength = "The length of the name must be at most 100 characters.";
    public const string SymbolMustExist = "A Synbol must be specified for a currency.";
    public const string SymbolLength = "The length of the symbol must be between 3 and 10 characters.";
    public const string BaseCurrencyMustExistForSaving = "A base currency must be specified if you are saving a custom currency.";
    public const string ValueInBaseCurrencyMustBeGreaterThanZero = "A currency with negative value cannot be created.";
    public const string CurrencyCreationProblem = "A problem has occurred while trying to create the currency.";
    public const string FailedToConvertCurrenciesToDollar = "Couldn't get the value in dollar from the currencies.";
    public const string FailedToUpdateCurrencyValue = "It wasn't possible to update the value of the currency.";
    public const string FailedToCommitChanges = "Changes were not saved.";
    public const string FailedToRetrieveExchangeRatesFromExternalApi = "Failed to get the earliest exchange rates from the external API.";
    public const string FailedToGetListOfCurrencies = "Couldn't the list of saved currencies.";
    public const string FailedToDeleteCurrency = "An error occurred while trying to delete curerncy.";
    public const string CannotConvertFromAEmptySymbol = "The symbols of the conversion must be given.";
}