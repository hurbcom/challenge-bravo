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
            if (!fromCurrency.Rate.HasValue) throw new ApplicationException("Rate not found for currency: " + from);
            var toCurrency = _currencyRepository.Read(to);
            if (toCurrency == null) throw new KeyNotFoundException("Currency not found: " + to);
            if (!toCurrency.Rate.HasValue) throw new ApplicationException("Rate not found for currency: " + to);
            return amount * (toCurrency.Rate.Value / fromCurrency.Rate.Value);
        }
    }
}
