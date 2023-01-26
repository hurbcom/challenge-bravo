namespace Cuco.Application.Contracts.Requests;

public class CurrencyConversionRequest
{
    public string FromCurrency { get; init; }
    public string ToCurrency { get; init; }
    public decimal Amount { get; init; }
}