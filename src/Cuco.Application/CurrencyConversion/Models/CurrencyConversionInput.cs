namespace Cuco.Application.CurrencyConversion.Models;

public class CurrencyConversionInput
{
    public string FromCurrency { get; set; }
    public string ToCurrency { get; set; }
    public decimal Amount { get; set; }
}