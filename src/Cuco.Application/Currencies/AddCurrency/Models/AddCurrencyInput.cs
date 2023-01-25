namespace Cuco.Application.Currencies.AddCurrency.Models;

public class AddCurrencyInput
{
    public string Name { get; private set; }
    public string Symbol { get; private set; }
    public string BaseCurrencySymbol { get; private set; }
    public decimal BaseCurrencyValue { get; private set; }
    public bool IsReal { get; private set; }
}