using Project.Business.DTOs;
using System.Threading.Tasks;

namespace Project.Business.Facades.Interface
{
    //ToDo: Refactoring - Review the name of the interface to be more legible/semantic (make more sense)
    //ToDo: Refactoring - Review the name of the methods to be more legible/semantic (make more sense)
    public interface ICurrencyConversionBusinessFacade
    {
        Task<CurrencyDTO> GetCurrencyQuotation(string currencyTicker);
        Task<ConvertedCurrencyDTO> GetCurrencyConverted(string fromCurrency, string toCurrency, decimal amount);
    }
}
