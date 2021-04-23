using System.Threading.Tasks;

namespace CurrencyConverter.Services
{
    public interface ICurrencyExternalApi
    {
        public Task<decimal> GetActualCurrencyValueByName(string currencyName);
        public Task<string> GetActualCurrenciesNames();
    }
}
