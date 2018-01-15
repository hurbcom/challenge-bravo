using Project.Business.DTOs;
using System.Threading.Tasks;

namespace Project.Business.Facades.Interface
{
    //ToDo: Refactoring - Review the name of the interface to be more legible/semantic (make more sense)
    //ToDo: Refactoring - Review the name of the methods to be more legible/semantic (make more sense)
    public interface ICurrencyConversionFacade
    {
        Task<CurrencyDTO> GetCurrencyQuotation(string currencyTicker);
        Task<decimal> GetCurrencyConverted(string fromCurrency, string toCurrency, decimal amount);
        decimal Convert(string fromCurrency, CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal amount); 
    }
}
