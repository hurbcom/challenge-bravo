namespace Cuco.Application.Currencies.UpdateCurrency.Models;

public class UpdateCurrencyInput
{
    public string Name { get; set; }
    public string Symbol { get; set; }
    public string BaseCurrencySymbol { get; set; }
    public decimal? BaseCurrencyValue { get; set; }
}