using Project.Business.DTOs;
using System.Threading.Tasks;

namespace Project.Business.Facades.Interface
{
    public interface ICurrencyConversionBusinessFacade
    {
        Task<CurrencyDTO> GetCurrencyQuotation(string currencySymbol);
        Task<ConvertedCurrencyDTO> GetCurrencyConverted(string fromCurrency, string toCurrency, decimal amount);
        decimal Convert(string fromCurrency, CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal amount);
        decimal GetAmountValueInUsdCurrency(CurrencyDTO currencyData, decimal amount);
        decimal GetConvertedValueForAnyCurrency(CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal toCurrencyUnitPriceInUsd, decimal amount);
    }
}
