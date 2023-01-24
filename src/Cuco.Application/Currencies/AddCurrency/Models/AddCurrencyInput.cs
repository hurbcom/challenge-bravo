namespace Cuco.Application.Currencies.AddCurrency.Models;

public class AddCurrencyInput
{
    public string Name { get; set; }
    public string Symbol { get; set; }
    public string BaseCurrencySymbol { get; set; }
    public decimal BaseCurrencyValue { get; set; }
    public bool IsReal { get; set; }
}