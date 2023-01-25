namespace Cuco.Application.Currencies.UpdateCurrency.Models;

public class UpdateCurrencyInput
{
    public string Name { get; private set; }
    public string Symbol { get; private set; }
    public string BaseCurrencySymbol { get; private set; }
    public decimal? BaseCurrencyValue { get; private set; }
}