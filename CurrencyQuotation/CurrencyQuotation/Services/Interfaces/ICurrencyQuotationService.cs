namespace CurrencyQuotation.Services.Interfaces
{
    public interface ICurrencyQuotationService
    {
        decimal GetQuotation(string from, string to, decimal amount);
    }
}
