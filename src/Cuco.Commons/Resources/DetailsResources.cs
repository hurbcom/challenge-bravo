namespace Cuco.Commons.Resources;

public static class DetailsResources
{
    public static string SuccessfullyConverted(this string fromSymbol, string toSymbol)
    {
        return $"Successfully converted from {fromSymbol.ToUpper()} to {toSymbol.ToUpper()}";
    }

    public const string SameCurrencyMessage = "The currencies are the same, therefore the amount doesn't change.";
    public const string SuccessfullyUpdatedCurrency = "The Currency has been updated.";
    public const string SuccessfullyAddedCurrency = "The Currency has been added.";
    public const string SuccessfullySyncedCurrencies = "VALUE";
}