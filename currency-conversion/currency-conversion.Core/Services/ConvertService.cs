using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Interfaces.Services;

namespace currency_conversion.Core.Services
{
    public class ConvertService : IConvertService
    {
        private readonly ICurrencyRepository _currencyRepository;
        public ConvertService(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }
        public double Convert(string from, string to, double amount)
        {
            var fromCurrency = _currencyRepository.Read(from);
            if (fromCurrency == null) throw new KeyNotFoundException("Currency not found: " + from);
            var toRateCurrency = _currencyRepository.Read(to);
            if (toRateCurrency == null) throw new KeyNotFoundException("Currency not found: " + to);
            return amount * (fromCurrency.Rate / toRateCurrency.Rate);
        }
    }
}
