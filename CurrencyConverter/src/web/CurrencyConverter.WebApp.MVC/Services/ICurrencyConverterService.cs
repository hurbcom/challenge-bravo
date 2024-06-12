using CurrencyConverter.Core.Models;
using CurrencyConverter.WebApp.MVC.Models;

namespace CurrencyConverter.WebApp.MVC.Services
{
    public interface ICurrencyConverterService
    {
        Task<CurrencyConverterResponse> Converter(CurrencyConverterViewModel currencyConverterViewModel);
        Task<CurrencyResponse> Create(CurrencyViewModel currencyViewModel);
        Task<FictionCurrenciesResponse> GetAll();
        Task<CurrencyResponse> Delete(string code);
    }

    public class FictionCurrenciesResponse
    {
        public List<CurrencyViewModel> Currencies { get; set; }
        public ResponseResult ResponseResult { get; set; }
    }
}
