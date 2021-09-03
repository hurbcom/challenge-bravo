using CurrencyQuotation.Models.Dtos;

namespace CurrencyQuotation.Services.Interfaces
{
    public interface ICurrencyQuotationService
    {
        decimal GetQuotation(string from, string to, decimal amount);
        bool InsertNewCurrency(CurrencyDto currencyDto);
    }
}
